package com.bpshparis.wsvc.app0;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.GsonBuilder;
import com.ibm.watson.developer_cloud.discovery.v1.Discovery;
import com.ibm.watson.developer_cloud.discovery.v1.model.document.CreateDocumentRequest;
import com.ibm.watson.developer_cloud.discovery.v1.model.document.CreateDocumentResponse;
import com.ibm.watson.developer_cloud.discovery.v1.model.query.QueryRequest;
import com.ibm.watson.developer_cloud.discovery.v1.model.query.QueryResponse;
import com.ibm.watson.developer_cloud.http.HttpMediaType;
import com.ibm.watson.developer_cloud.natural_language_understanding.v1.NaturalLanguageUnderstanding;
import com.ibm.watson.developer_cloud.natural_language_understanding.v1.model.AnalysisResults;
import com.ibm.watson.developer_cloud.natural_language_understanding.v1.model.AnalyzeOptions;
import com.ibm.watson.developer_cloud.natural_language_understanding.v1.model.CategoriesOptions;
import com.ibm.watson.developer_cloud.natural_language_understanding.v1.model.EntitiesOptions;
import com.ibm.watson.developer_cloud.natural_language_understanding.v1.model.Features;
import com.ibm.watson.developer_cloud.natural_language_understanding.v1.model.KeywordsOptions;
import com.ibm.watson.developer_cloud.tone_analyzer.v3.ToneAnalyzer;
import com.ibm.watson.developer_cloud.tone_analyzer.v3.model.Tone;
import com.ibm.watson.developer_cloud.tone_analyzer.v3.model.ToneAnalysis;
import com.ibm.watson.developer_cloud.tone_analyzer.v3.model.ToneOptions;
import com.ibm.watson.developer_cloud.visual_recognition.v3.VisualRecognition;
import com.ibm.watson.developer_cloud.visual_recognition.v3.model.ClassifyImagesOptions;
import com.ibm.watson.developer_cloud.visual_recognition.v3.model.DetectedFaces;
import com.ibm.watson.developer_cloud.visual_recognition.v3.model.RecognizedText;
import com.ibm.watson.developer_cloud.visual_recognition.v3.model.VisualClassification;
import com.ibm.watson.developer_cloud.visual_recognition.v3.model.VisualRecognitionOptions;

/**
 * Servlet implementation class AppendSelectionsServlet
 */
@WebServlet(name = "AnalyzeServlet", urlPatterns = { "/Analyze" })
public class AnalyzeServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	NaturalLanguageUnderstanding nlu;
	ToneAnalyzer ta;
	Discovery d;
	VisualRecognition vr;
	String dEnvId;
	String dCollId;
	String mailsPath;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public AnalyzeServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	@SuppressWarnings("unchecked")
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub

		List<Mail> mails = new ArrayList<Mail>();
		
		Map<String, Object> reqParms = new HashMap<String, Object>();
		Map<String, Object> datas = new HashMap<String, Object>(); 
		datas.put("FROM", this.getServletName());
		
		try {
			
			mailsPath = getServletContext().getRealPath("/res/mails");

			d = (Discovery) request.getServletContext().getAttribute("d");
			dEnvId = (String) request.getServletContext().getAttribute("dEnvId");
			dCollId = (String) request.getServletContext().getAttribute("dCollId");
			
			if(ServletFileUpload.isMultipartContent(request)){
			
				List<FileItem> items = new ServletFileUpload(new DiskFileItemFactory()).parseRequest(request);
				for (FileItem item : items) {
					if (!item.isFormField() && item.getFieldName().equalsIgnoreCase("mails")) {
						// item is the file (and not a field)
						mails = Tools.MailsListFromJSON(item.getInputStream());
						
						for(Mail mail: mails){
							if(mail.getAttached() != null){
								datas.put("UPLOAD_" + mail.getAttached() + "_RESPONSE", uploadAttached(mail));
							}
						}
						
						request.getSession().setAttribute("mails", mails);
						datas.put("MAILS", mails);
						
					}
					if (item.isFormField() && item.getFieldName().equalsIgnoreCase("parms")) {
						item.getFieldName();
			            String value = item.getString();
			            reqParms = Tools.fromJSON(new ByteArrayInputStream(value.getBytes()));
			            datas.put("REQ_PARMS", reqParms);
					}
				}
			}
			else {
				
				reqParms = Tools.fromJSON(request.getInputStream());
				mails = (List<Mail>) request.getSession().getAttribute("mails");
				
				datas.put("REQ_PARMS", reqParms);
				datas.put("MAILS", mails);
				
				for(Mail mail: mails){
					
					ta = (ToneAnalyzer) request.getServletContext().getAttribute("ta");
					datas.put("TONEANALYSIS_SUBJECT_RESPONSE", callTA(mail));
					
					nlu = (NaturalLanguageUnderstanding) request.getServletContext().getAttribute("nlu");
					datas.put("ANALYSIS_CONTENT_RESPONSE", callNLU(mail));
					
					vr = (VisualRecognition) request.getServletContext().getAttribute("vr");
	
					if(mail.getPicture() != null){
						datas.put("VISUAL_CLASSIFICATION_" + mail.getPicture() + "_RESPONSE", callVR(mail));
					}
	
					if(mail.getFace() != null){
						datas.put("DETECTED_FACE_" + mail.getFace() + "_RESPONSE", callFR(mail));
					}
					
					if(mail.getTextInPicture() != null){
						datas.put("RECOGNIZED_TEXT_" + mail.getTextInPicture() + "_RESPONSE", callTR(mail));
					}
					
					if(mail.getdId() != null){
						datas.put("QUERY_RESPONSE_" + mail.getAttached() + "_RESPONSE", callD(mail));
					}
				}
			}
		}
		
		catch(JsonMappingException e){
			Properties props = (Properties) getServletContext().getAttribute("props");
			datas.put("UPLOAD_USAGE", props.get("UPLOAD_USAGE"));
			datas.put("ANALYZE_USAGE", props.get("ANALYZE_USAGE"));
			datas.put("WARNING_USAGE", props.get("WARNING_USAGE"));
			datas.put("UPLOAD_EXAMPLE", props.get("UPLOAD_EXAMPLE"));
			datas.put("ANALYZE_EXAMPLE", props.get("ANALYZE_EXAMPLE"));
//			datas.put("EXAMPLE", ( (String) props.get("EXAMPLE")).replaceAll("\\\"", "\""));
//			datas.put("EXAMPLE", props.get("EXAMPLE"));
//			datas.put("EXAMPLE", ( (String) props.get("EXAMPLE")).replaceAll("\\\\", ""));

		}
		
		catch (Exception e) {
			// TODO Auto-generated catch block
			datas.put("EXCEPTION", e.getClass().getName());
			datas.put("MESSAGE", e.getMessage());
			StringWriter sw = new StringWriter();
			e.printStackTrace(new PrintWriter(sw));
//			datas.put("STACKTRACE", sw.toString());
		}
		
		finally{
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(Tools.toJSON(datas));
		}
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
	
	protected CreateDocumentResponse uploadAttached(Mail mail) throws ArrayIndexOutOfBoundsException, JsonParseException, JsonMappingException, IOException{
		
		String file = mailsPath + "/" + mail.getAttached(); 
		InputStream in = new BufferedInputStream(new FileInputStream(file));
		new HashMap<String, String>();
		
		String mt = "";
		int i = mail.getAttached().split("\\.").length; 
		String ext = mail.getAttached().split("\\.")[i - 1];

		switch(ext){
		
			case "doc":
				mt = HttpMediaType.APPLICATION_MS_WORD;
				break;

			case "pdf":
				mt = HttpMediaType.APPLICATION_PDF;
				break;

			default:
				mt = HttpMediaType.TEXT_PLAIN;
				break;
			
		}
		
		CreateDocumentRequest.Builder builder = new CreateDocumentRequest.Builder(dEnvId, dCollId)
				.file(in, mt);		
		CreateDocumentResponse result = d.createDocument(builder.build()).execute();
		
		ObjectMapper mapper = new ObjectMapper();
    	
    	Map<String, String> resultMap = mapper.readValue(result.toString(), new TypeReference<Map<String, String>>(){});
    	
		System.out.println("resultMap=" + resultMap);
    	
    	mail.setdId(resultMap.get("document_id"));
    	
    	return result;
		
	}
	
	@SuppressWarnings("unchecked")
	protected String listAttachedColl() throws JsonParseException, JsonMappingException, IOException{
		
		List<String> fields = new ArrayList<String>();
		fields.add("extracted_metadata");
    	
    	QueryRequest.Builder queryBuilder = new QueryRequest.Builder(dEnvId, dCollId)
    			.count(100)
    			.returnFields(fields);
    	
    	QueryResponse queryResponse = d.query(queryBuilder.build()).execute();
    	
    	System.out.println("queryResponse=" + queryResponse);
    	
    	ObjectMapper mapper = new ObjectMapper();
    	
    	Map<String, Object> docMap = mapper.readValue(queryResponse.toString(), new TypeReference<Map<String, Object>>(){});

		List<Map<String, String>> docs = (List<Map<String, String>>) docMap.get("results");
		
		List<String> docIds = new ArrayList<String>();

		for(Map<String, String> doc: docs){
			docIds.add(doc.get("id"));
		}
		
		System.out.println("docIds=" + docIds);
		
		return queryResponse.toString();		
		
	}
	
	protected VisualClassification callVR(Mail mail) throws IOException{
		
		Path path = Paths.get(mailsPath + "/" + mail.getPicture());
		byte[] data = Files.readAllBytes(path);
		
		ClassifyImagesOptions classifyImagesOptions = new ClassifyImagesOptions.Builder()
				.images(data, mail.getPicture())
				.build();
		VisualClassification result = vr.classify(classifyImagesOptions).execute();
		
		mail.setVr(result);

		return result;
	}

	protected DetectedFaces callFR(Mail mail) throws IOException{
		
		Path path = Paths.get(mailsPath + "/" + mail.getFace());
		byte[] data = Files.readAllBytes(path);
		
		new GsonBuilder().setPrettyPrinting().create();
		
		VisualRecognitionOptions options = new VisualRecognitionOptions.Builder()
				.images(data, mail.getFace())
				.build();

		DetectedFaces result = vr.detectFaces(options).execute();
		
		mail.setFr(result);

		return result;
	}
	
	protected RecognizedText callTR(Mail mail) throws IOException{
		
		Path path = Paths.get(mailsPath + "/" + mail.getTextInPicture());
		byte[] data = Files.readAllBytes(path);
		
//		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		
		VisualRecognitionOptions options = new VisualRecognitionOptions.Builder()
				.images(data, mail.getTextInPicture())
				.build();

		RecognizedText result = vr.recognizeText(options).execute();
		
		mail.setTr(result);

		return result;
	}
	
	
	protected QueryResponse callD(Mail mail){

		List<String> fields = new ArrayList<String>();
		fields.add("extracted_metadata");
    	
    	QueryRequest.Builder queryBuilder = new QueryRequest.Builder(dEnvId, dCollId)
    			.aggregation("term(enriched_text)")
    			.filter("_id:" + mail.getdId());
    	
    	QueryResponse result = d.query(queryBuilder.build()).execute();

    	mail.setD(result);
		
		return result;
	}
	
	protected ToneAnalysis callTA(Mail mail){

		ToneOptions options = new ToneOptions.Builder()
			.addTone(Tone.EMOTION).build();
		
		ToneAnalysis result = ta.getTone(mail.getSubject(), options).execute();
		mail.setTa(result);
			  
		return result;
	}
	
	protected AnalysisResults callNLU(Mail mail){
		
		EntitiesOptions entitiesOptions = new EntitiesOptions.Builder()
			.emotion(true)
			.sentiment(true)
			.limit(2)
			.build();

		KeywordsOptions keywordsOptions = new KeywordsOptions.Builder()
			.emotion(true)
			.sentiment(true)
			.limit(2)
			.build();
		
		CategoriesOptions categories = new CategoriesOptions();

		Features features = new Features.Builder()
			.categories(categories)
			.entities(entitiesOptions)
			.keywords(keywordsOptions)
			.build();

		AnalyzeOptions parameters = new AnalyzeOptions.Builder()
			.features(features)
			.text(mail.getContent())
			.build();
		
		AnalysisResults result = nlu
			.analyze(parameters)
			.execute();

		mail.setNlu(result);
		
		return result;
	}

}
