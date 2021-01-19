import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseServiceService } from '../services/firebase-service.service';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  closeResult = '';

  alumnoForm: FormGroup;

  idFirebaseActualizar: string;
  actualizar: boolean;

  constructor(private modalService: NgbModal,
    public fb: FormBuilder,
    private firebaseServiceService: FirebaseServiceService) { }

    config: any;
    collection = { count: 20, data: []}

  ngOnInit(): void {
    this.idFirebaseActualizar = "";
    this.actualizar = false;

    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.collection.count
    };

    this.alumnoForm = this.fb.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      edad: ['', Validators.required],
      sexo: ['', Validators.required],
      correo: ['', Validators.required]
    });

    this.firebaseServiceService.getAlumnos().subscribe(resp => {
      this.collection.data = resp.map((e: any) => {
        return{
        id: e.payload.doc.data().id,
        nombre: e.payload.doc.data().nombre,
        edad: e.payload.doc.data().edad,
        sexo: e.payload.doc.data().sexo,
        correo: e.payload.doc.data().correo,
        idFirebase: e.payload.doc.id
        }
      })
    },
    error => {
      console.error(error);
    }
   );
  }

  pageChanged(event){
    this.config.currentPage = event;
  }

  eliminar(item:any):void{
    this.firebaseServiceService.deleteAlumno(item.idFirebase);
  }

  guardarAlumno ():void {
    this.firebaseServiceService.createAlumno(this.alumnoForm.value).then(resp => {
      this.alumnoForm.reset();
      this.modalService.dismissAll();
    }).catch(error =>{
      console.error(error)
    })
    
  }


  actualizarAlumno (){

    if(!isNullOrUndefined(this.idFirebaseActualizar)){
    this.firebaseServiceService.updateAlumno(this.idFirebaseActualizar, this.alumnoForm.value).then(resp => {
      this.alumnoForm.reset();
      this.modalService.dismissAll();
    }).catch(error => {
      console.error(error);
    });
  }
}

  openEditar(content, item:any) {

    this.alumnoForm.setValue({
      id: item.id,
      nombre: item.nombre,
      edad: item.edad,
      sexo: item.sexo,
      correo: item.correo
    });
    this.idFirebaseActualizar = item.idFirebase;
    this.actualizar = true;


    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  open(content) {
    this.actualizar = false;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}


