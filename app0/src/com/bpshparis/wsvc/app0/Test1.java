package com.bpshparis.wsvc.app0;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

public class Test1 {

	@SuppressWarnings("unchecked")
	public static void main(String[] args) throws IOException {
		// TODO Auto-generated method stub

		List<Mail>	mails = new ArrayList<Mail>();
		Map<String, Object> ta = new HashMap<String, Object>();
		
		Path path = Paths.get("/opt/wks/watson/app0/WebContent/res/mails/f0");
		Charset charset = StandardCharsets.UTF_8;
//		
//		String s = new String(Files.readAllBytes(path));
//		
//		System.out.println(s.replaceAll("[\\s]", ""));
		
		
//		String s = "\\\\\"test";    // the actual String is: \\"test
//		System.out.println(s);
//		System.out.println(s.replaceAll("\\\\\\\\\"", "\""));
		
		InputStream is  = new ByteArrayInputStream(Files.readAllBytes(path));
		
		InputStreamReader isr = new InputStreamReader(is);
		BufferedReader br = new BufferedReader(isr);
        ObjectMapper mapper = new ObjectMapper();
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
//		mails = mapper.readValue(br, new TypeReference<List<Mail>>(){});
		ta = mapper.readValue(br, new TypeReference<Map<String, Object>>(){});
		System.out.println("ta=" + ta);
//		System.out.println(mails.get(0).getAnalysis().getTa());
		
	}
	
}
