package com.bpshparis.wsvc.app0;

public class Contact {

	String prenom = "";
	String nom = "";
	String societe = "";
	String email = "";
	String telephone = "";
	String _rev = null;
	String _id = "";

	public String getPrenom() {
		return prenom;
	}
	public void setPrenom(String prenom) {
		this.prenom = prenom;
	}
	public String getNom() {
		return nom;
	}
	public void setNom(String nom) {
		this.nom = nom;
	}
	public String getSociete() {
		return societe;
	}
	public void setSociete(String societe) {
		this.societe = societe;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getTelephone() {
		return telephone;
	}
	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}
	public String get_rev() {
		return _rev;
	}
	public void set_rev(String _rev) {
		this._rev = _rev;
	}
	public String get_id() {
		return _id;
	}
	public void set_id(String _id) {
		this._id = _id;
	}
	public String toString(){
		return "{ \n_id: " + get_id() + ",\n_rev: " + get_rev() + ",\nprenom: " + getPrenom() + ",\nnom: " + getNom() + ",\nsociete: " + getSociete() + ",\nemail: " + getEmail() + ",\ntelephone: " + getTelephone() + "\n}"; 
	}
	
}
