import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {GridComponent} from "../components/grid/grid.component";
import {Observable} from "rxjs";
import {longResponse, MyResponse} from "../model";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  basepath:string
  constructor(private httpClient: HttpClient) {
    this.basepath = "http://localhost:8080/api/power"
  }

  start(source: GridComponent):Observable<MyResponse>{
    let header:HttpHeaders = new HttpHeaders().set('Access-Control-Allow-Origin', 'http://localhost:8080/api/power/state').set('Content-Type', 'application/json; charset=UTF-8"')
    return this.httpClient.get<MyResponse>(this.basepath + '/state' )
  }

  newNode(source: GridComponent, x:number, y:number):Observable<number> {
    return this.httpClient.post<number>(this.basepath + '/new', {'x':x,'y':y, 'type':'NODE'})
  }

  newSwitch(source: GridComponent, x:number, y:number):Observable<number> {
    return this.httpClient.post<number>(this.basepath + '/new', {'x':x,'y':y, 'type':'SWITCH'})
  }

  newSource(source: GridComponent, x:number, y:number):Observable<number> {
    return this.httpClient.post<number>(this.basepath + '/new', {'x':x,'y':y, 'type':'SOURCE'})
  }

  deleteNode(id:number):Observable<any> {
     return this.httpClient.delete<number>(this.basepath + '/remove/' + id )
  }

  move(id:number, x:number, y:number):Observable<any> {
      return this.httpClient.put(this.basepath + '/move', {'id':id, 'type':'NODE', 'x':x,'y':y, 'state':0} )
  }

  connect(nodeId:number, targetId:number):Observable<any> {
    return this.httpClient.put(this.basepath + '/connect/'+nodeId+'/'+targetId, {} )
  }

  changeState(nodeId:number):Observable<any>{
    return this.httpClient.put(this.basepath + '/change/'+nodeId, {} )
  }

  removeCon(id:number):Observable<any>{
    return this.httpClient.delete(this.basepath + '/removecon/'+id )
  }

  undo():Observable<any>{
    return this.httpClient.put(this.basepath + '/undo', {} )
  }

  redo():Observable<any>{
    return this.httpClient.put(this.basepath + '/redo', {} )
  }
}
