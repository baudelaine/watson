package com.bpshparis.wsvc.app0;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.cloudant.client.api.Database;
import com.cloudant.client.api.views.AllDocsRequest;

/**
 * Servlet implementation class AppendSelectionsServlet
 */
@WebServlet(name = "RecupererContact", urlPatterns = { "/RecupererContact" })
public class RecupererContactServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	List<Contact> contacts;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RecupererContactServlet() {
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
			
			// Get a Contact out of the database and deserialize the JSON into a Java type
						//Contact contact0 = db.find(Contact.class,"prenom0.nom0");
						//System.out.println(contact0);
						
			// Get all Contact out of the database and add then to List<Contact> contacts
			@SuppressWarnings("unused")
			AllDocsRequest allDocsRequest =
					 //get a request builder for the "_all_docs" endpoint
					 db.getAllDocsRequestBuilder()
					   //set any other required parameters e.g. doc id of "foo" or "bar"
					   //.keys("foo", "bar")
					   //build the request
					   .build();
			
			List<Contact> contacts = db.getAllDocsRequestBuilder().includeDocs(true).build().getResponse().getDocsAs(Contact.class);
			
			for(Contact contact: contacts){
				System.out.println(contact);
			}
	        
	        System.out.println("contacts=" + contacts);		
	        
	        request.getServletContext().setAttribute("contacts", contacts);
	        
	        response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(Tools.toJSON(contacts));
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
