/*

# cf service-key db0 user0
Getting key user0 for service instance db0 as sebastien.gautier@fr.ibm.com...

{
 "host": "82ba6b45-80da-4c57-b993-a1b7d903ffa2-bluemix.cloudant.com",
 "password": "42abcf18139123bcd01a4d790627d46a91c44ff0e78e68b22c7e9538e8ed7371",
 "port": 443,
 "url": "https://82ba6b45-80da-4c57-b993-a1b7d903ffa2-bluemix:42abcf18139123bcd01a4d790627d46a91c44ff0e78e68b22c7e9538e8ed7371@82ba6b45-80da-4c57-b993-a1b7d903ffa2-bluemix.cloudant.com",
 "username": "82ba6b45-80da-4c57-b993-a1b7d903ffa2-bluemix"
}

echo $VCAP_SERVICES

{"cloudantNoSQLDB":[{"credentials":{"username":"82ba6b45-80da-4c57-b993-a1b7d903ffa2-bluemix","password":"42abcf18139123bcd01a4d790627d46a91c44ff0e78e68b22c7e9538e8ed7371","host":"82ba6b45-80da-4c57-b993-a1b7d903ffa2-bluemix.cloudant.com","port":443,"url":"https://82ba6b45-80da-4c57-b993-a1b7d903ffa2-bluemix:42abcf18139123bcd01a4d790627d46a91c44ff0e78e68b22c7e9538e8ed7371@82ba6b45-80da-4c57-b993-a1b7d903ffa2-bluemix.cloudant.com"},"syslog_drain_url":null,"label":"cloudantNoSQLDB","provider":null,"plan":"Lite","name":"db0","tags":["data_management","ibm_created","lite","ibm_dedicated_public"]}]}

*/
package com.bpshparis.wsvc.app0;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.swing.text.html.HTMLDocument.Iterator;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

import com.cloudant.client.api.ClientBuilder;
import com.cloudant.client.api.CloudantClient;
import com.cloudant.client.api.Database;
import com.cloudant.client.api.views.AllDocsRequest;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

public class Test0 {

	@SuppressWarnings("unchecked")
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		String dbname = "contacts";
		
		String serviceName = "cloudantNoSQLDB";
		String vcapFile = "/opt/wks/tdazlan/demo1/WebContent/js/vcap.json";
		
		try {
			
			BufferedReader br = new BufferedReader(new FileReader(vcapFile));
			String json = "";
			ObjectMapper mapper = new ObjectMapper();
			
			String url = "";
			String username = "";
			String password = "";
			
			if(br != null){
	            while((json = br.readLine()) != null){
	            	
	    			System.out.println("json="+json);
	    			
	    			Map<String, Object> input = mapper.readValue(json, new TypeReference<Map<String, Object>>(){});
	    			
	    			List<Map<String, Object>> l0s = (List<Map<String, Object>>) input.get(serviceName);
	    			
	    			for(Map<String, Object> l0: l0s){
	    				for(Map.Entry<String, Object> e: l0.entrySet()){
	    					if(e.getKey().equalsIgnoreCase("credentials")){
	    						System.out.println(e.getKey() + "=" + e.getValue());
	    						Map<String, Object> credential = (Map<String, Object>) e.getValue();
	    						url = (String) credential.get("url");
	    						username = (String) credential.get("username");
	    						password = (String) credential.get("password");
	    							
	    					}
	    				}
	    			}
	            	
	            }
			}
			
			
			CloudantClient client = ClientBuilder.url(new URL(url))
			        .username(username)
			        .password(password)
			        .build();
		
			System.out.println("Server Version: " + client.serverVersion());
			
			// Get a List of all the databases this Cloudant account
			List<String> databases = client.getAllDbs();
			System.out.println("All my databases : ");
			for ( String db : databases ) {
				// Delete a database if already exists.
				if(db.equalsIgnoreCase(dbname)){
					client.deleteDB(dbname);
					System.out.println("Deleting database : " + dbname);
				}
			}
			
			client.createDB(dbname);
			
			// Get a Database instance to interact with, but don't create it if it doesn't already exist
			Database db = client.database(dbname, false);
			
			for(int i = 0; i < 10; i++){
			
				Contact contact = new Contact();
				contact.set_id("prenom" + i +".nom" + i);
				contact.setPrenom("prenom" + i);
				contact.setNom("nom" + i);
				contact.setSociete("societe" + i);
				contact.setEmail("prenom" + i + ".nom" + i +"@email" + i);
				contact.setTelephone("+3355555555" + i);
				
				
				// Create a Contact and save it in the database
				db.save(contact);
				System.out.println("You have inserted a contact in database " + dbname);
	
			}
			
			// Get a Contact out of the database and deserialize the JSON into a Java type
			//Contact contact0 = db.find(Contact.class,"prenom0.nom0");
			//System.out.println(contact0);
			
			// Get all Contact out of the database and add then to List<Contact> contacts
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
			
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		

	}

}
