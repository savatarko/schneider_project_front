import {Component, HostListener} from '@angular/core';
import {Line, Node, Source, Switch} from "../../model";
import {range} from "rxjs";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent {
  source: Source[] = []
  switches:Switch[] = []
  nodes:Node[] = []


  mode:boolean[] = []

  currentline:Line = {
    id:0,
    x:null,
    y:null
  }

  lines:Line[] =[]

  service:ApiService

  constructor(service:ApiService) {
    for(var i =0;i<7;i++){
      this.mode[i] = false
    }
    this.mode[0] = true
    this.service = service
    this.loadData()
  }

  loadData(){
    this.source = []
    this.switches = []
    this.nodes = []
    this.lines = []
    this.service.start(this).subscribe(val=>{
      val.abstractNodes.forEach(x=>{
        if(x.type === "SOURCE"){
          this.source.push({
            id:x.id,
            x:x.x,
            y:x.y,
            width:50,
            height:60,
            state:x.state === 1
          })
        }
        if(x.type === "SWITCH"){
          this.switches.push({
            id:x.id,
            x:x.x,
            y:x.y,
            width:100,
            height:50,
            state:x.state === 1
          })
        }
        if(x.type === "NODE"){
          this.nodes.push({
            id:x.id,
            x:x.x,
            y:x.y,
            width:60,
            height:60,
            state:x.state
          })
        }
      })
      val.connections.forEach(x=>{
        var target = this.nodes.find(y=>y.id === x.targetId)!
        var s = null
        for(var i = 0;i<this.source.length;i++){
          if(this.source[i].id === x.sourceId){
            s = this.source[i]
          }
        }
        if(s==null){
          for(var i = 0;i<this.switches.length;i++){
            if(this.switches[i].id === x.sourceId){
              s = this.switches[i]
            }
          }
        }
        this.lines.push({
          id:x.id,
          x:target,
          y:s
        })
      })
    })
  }

  switchMove(){
    for(var i =0;i<7;i++){
      this.mode[i] = false
    }
    this.mode[0] = true
  }

  switchConnect(){
    for(var i =0;i<7;i++){
      this.mode[i] = false
    }
    this.mode[1] = true
  }

  switchSource(){
    for(var i =0;i<7;i++){
      this.mode[i] = false
    }
    this.mode[2] = true
  }

  switchSwitch(){
    for(var i =0;i<7;i++){
      this.mode[i] = false
    }
    this.mode[3] = true
  }

  switchNode(){
    for(var i =0;i<7;i++){
      this.mode[i] = false
    }
    this.mode[4] = true
  }

  switchDelete(){
    for(var i =0;i<7;i++){
      this.mode[i] = false
    }
    this.mode[5] = true
  }

  switchState(){
    for(var i =0;i<7;i++){
      this.mode[i] = false
    }
    this.mode[6] = true
  }

  //@HostListener('document:click', ['$event'])
  onClick(event:MouseEvent){

    if(this.mode[2]){
      if(this.source.length == 0){
        this.service.newSource(this, event.offsetX, event.offsetY).subscribe(val=>{
          const newSource: Source ={
            id:val,
            x:event.offsetX,
            y:event.offsetY,
            width:50,
            height:50,
            state:true
          }
          this.source.push(newSource)
        })
      }
    }
    if(this.mode[3]){
      this.service.newSwitch(this, event.offsetX, event.offsetY).subscribe(val=> {
        const newSwitch: Switch = {
          id:val,
          x:event.offsetX,
          y:event.offsetY,
          width:100,
          height:50,
          state:true
        }
        this.switches.push(newSwitch)
      })
    }
    if(this.mode[4]){
      this.service.newNode(this, event.offsetX, event.offsetY).subscribe(val=> {
        const newNode: Node = {
          id:val,
          x:event.offsetX,
          y:event.offsetY,
          width:60,
          height:60,
          state:3
        }
        this.nodes.push(newNode)
      })
    }


  }

  startDrag(event:MouseEvent, source:(Source | Node | Switch)) {
    if (this.mode[0]) {
      let offsetX = event.clientX - source.x;
      let offsetY = event.clientY - source.y;

      const mouseMoveHandler = (e: MouseEvent) => {
        source.x = e.clientX - offsetX;
        source.y = e.clientY - offsetY;
      };


      const mouseUpHandler = (e:MouseEvent) => {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        this.service.move(source.id, e.clientX - offsetX, e.clientY - offsetY).subscribe()
      };

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    }
  }

  removeNode(event:MouseEvent, source:Node){
    if(this.mode[5]){
      for(let i=0;i<this.nodes.length;i++){
        if(this.nodes[i] === source){
          this.service.deleteNode(source.id).subscribe(value => {
            this.loadData()
          })
        }
      }
    }
    if(this.mode[1]){
      this.currentline.x = source
      if(this.currentline.y && this.lines.indexOf(this.currentline)==-1){
        this.service.connect(this.currentline.x.id, this.currentline.y.id).subscribe(value=>{
          this.loadData()
        })
        this.currentline.x = null
        this.currentline.y = null
      }
    }
  }

  removeSwitch(event:MouseEvent, source:Switch){
    if(this.mode[5]){
      for(let i=0;i<this.nodes.length;i++){
        if(this.switches[i] === source){
          this.service.deleteNode(source.id).subscribe(value => {
            this.loadData()
          })
        }
      }
    }
    if(this.mode[1]){
      this.currentline.y = source
      if(this.currentline.x && this.lines.indexOf(this.currentline)==-1){
        this.service.connect(this.currentline.x.id, this.currentline.y.id).subscribe(value => {
          this.loadData()
        })
        this.currentline.x = null
        this.currentline.y = null
      }
    }
    if(this.mode[6]){
      this.service.changeState(source.id).subscribe(value => {
        this.loadData()
      })
    }
  }

  removeSource(event:MouseEvent, source:Source){
    if(this.mode[5]){
      this.source = []
      this.service.deleteNode(source.id).subscribe(value => {
        this.loadData()
      })
    }
    if(this.mode[1]){
      this.currentline.y = source
      if(this.currentline.x && this.lines.indexOf(this.currentline)==-1){
        this.service.connect(this.currentline.x.id, this.currentline.y.id).subscribe(value => {
          this.loadData()
        })
        this.currentline.x = null
        this.currentline.y = null
      }
    }
    if(this.mode[6]){
      this.service.changeState(source.id).subscribe(value => {
        this.loadData()
      })
    }
  }

  removeLine(event:MouseEvent, source:Line){
    if(this.mode[5]){
      this.service.removeCon(source.id).subscribe(value => {
        this.loadData()
      })
    }
  }

  getDistance(point1: Node | Source | Switch, point2: Node | Source | Switch): number {
    const dx = point2.x + point2.width/2 - point1.x - point1.width/2;
    const dy = point2.y + point2.height/2 - point1.y - point1.height/2;
    return Math.sqrt(dx * dx + dy * dy);
  }

  getLineRotation(point1: Node | Source | Switch, point2: Node | Source | Switch): string {
    const angle = Math.atan2(point2.y - point1.y + point2.height/2 - point1.height/2, point2.x + point2.width/2 - point1.x - point1.width/2);
    return `rotate(${angle}rad)`;
  }

  undo(){
    this.service.undo().subscribe(value => {
      this.loadData()
    })
  }
  redo(){
    this.service.redo().subscribe(value => {
      this.loadData()
    })
  }


  protected readonly onclick = onclick;
}
