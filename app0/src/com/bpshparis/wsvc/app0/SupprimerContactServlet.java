package com.bpshparis.wsvc.app0;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.cloudant.client.api.Database;
import com.cloudant.client.api.views.AllDocsRequest;
import com.cloudant.client.org.lightcouch.DocumentConflictException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;

/**
 * Servlet implementation class AppendSelectionsServlet
 */
@WebServlet(name = "SupprimerContact", urlPatterns = { "/SupprimerContact" })
public class SupprimerContactServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	List<Contact> contacts;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public SupprimerContactServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	@SuppressWarnings("unchecked")
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub

		
		try {
			
			Database db = (Database) request.getServletContext().getAttribute("db");
	    	System.out.println("db=" + db);
	    	
			contacts = (List<Contact>) request.getServletContext().getAttribute("contacts");
			
	        BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
	        String json = "";
	        ObjectMapper mapper = new ObjectMapper();
	
	        
	        if(br != null){
	        	json = br.readLine();
	        }

            System.out.println("json="+json);

            Map<String, Object> input = mapper.readValue(json, new TypeReference<Map<String, Object>>(){});
            
            
            List<String> _ids = (List<String>) input.get("_ids");
	        //List<String> _ids = mapper.readValue(json, TypeFactory.defaultInstance().constructCollectionType(List.class, String.class));
	        //String[] _ids = mapper.readValue(json, String[].class);
	        
	        for(String _id: _ids){
	        	System.out.println("Removing _id: " + _id);
	        	db.remove(db.find(Contact.class,_id));
	        }
	        
			// Get all Contact out of the database and add then to List<Contact> contacts
			AllDocsRequest allDocsRequest =
					 //get a request builder for the "_all_docs" endpoint
					 db.getAllDocsRequestBuilder()
					   //set any other required parameters e.g. doc id of "foo" or "bar"
					   //.keys("foo", "bar")
					   //build the request
					   .build();
			
			List<Contact> contacts = db.getAllDocsRequestBuilder().includeDocs(true).build().getResponse().getDocsAs(Contact.class);	        
	        
	        
	        System.out.println("contacts=" + contacts);		
	        response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(Tools.toJSON(contacts));
		}
		
		catch (DocumentConflictException dce) {
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write("{\"error\":\"conflict\",\"reason\":\"Document update conflict.\"}");
			return;
		}	
			
		catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
