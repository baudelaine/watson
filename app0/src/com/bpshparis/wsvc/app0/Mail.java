package com.bpshparis.wsvc.app0;

import com.ibm.watson.developer_cloud.discovery.v1.model.query.QueryResponse;
import com.ibm.watson.developer_cloud.natural_language_understanding.v1.model.AnalysisResults;
import com.ibm.watson.developer_cloud.tone_analyzer.v3.model.ToneAnalysis;
import com.ibm.watson.developer_cloud.visual_recognition.v3.model.DetectedFaces;
import com.ibm.watson.developer_cloud.visual_recognition.v3.model.RecognizedText;
import com.ibm.watson.developer_cloud.visual_recognition.v3.model.VisualClassification;

public class Mail {

	private String subject;
	private String content;
	private String attached;
	private String picture;
	private String textInPicture;
	private String face;
	private String url;
	private AnalysisResults nlu;
	private ToneAnalysis ta;
	private QueryResponse d;
	private String dId;
	private VisualClassification vr;
	private DetectedFaces fr;
	private RecognizedText tr;
	
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getAttached() {
		return attached;
	}
	public void setAttached(String attached) {
		this.attached = attached;
	}
	public String getPicture() {
		return picture;
	}
	public void setPicture(String picture) {
		this.picture = picture;
	}
	public String getTextInPicture() {
		return textInPicture;
	}
	public void setTextInPicture(String textInPicture) {
		this.textInPicture = textInPicture;
	}
	public String getFace() {
		return face;
	}
	public void setFace(String face) {
		this.face = face;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public AnalysisResults getNlu() {
		return nlu;
	}
	public void setNlu(AnalysisResults result) {
		this.nlu = result;
	}
	public ToneAnalysis getTa() {
		return ta;
	}
	public void setTa(ToneAnalysis result) {
		this.ta = result;
	}
	public QueryResponse getD() {
		return d;
	}
	public void setD(QueryResponse result) {
		this.d = result;
	}
	public String getdId() {
		return dId;
	}
	public void setdId(String dId) {
		this.dId = dId;
	}
	public VisualClassification getVr() {
		return vr;
	}
	public void setVr(VisualClassification result) {
		this.vr = result;
	}
	public DetectedFaces getFr() {
		return fr;
	}
	public void setFr(DetectedFaces result) {
		this.fr = result;
	}
	public RecognizedText getTr() {
		return tr;
	}
	public void setTr(RecognizedText result) {
		this.tr = result;
	}
	
}
