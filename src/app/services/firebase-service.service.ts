import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  getAlumnos(){
    return this.firestore.collection("alumnos").snapshotChanges();
  }

  createAlumno(alumno:any){
    return this.firestore.collection("alumnos").add(alumno);
  }

  updateAlumno(id:any, alumno:any){
    return this.firestore.collection("alumnos").doc(id).update(alumno);
  }

  deleteAlumno(id:any){
    return this.firestore.collection("alumnos").doc(id).delete();
  }
}
