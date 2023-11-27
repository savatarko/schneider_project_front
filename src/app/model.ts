export interface Source{
  id:number,
  x:number,
  y:number,
  width:number,
  height:number,
  state:boolean
}

export interface Switch{
  id:number,
  x:number,
  y:number,
  width:number,
  height:number,
  state:boolean
}

export interface Node{
  id:number,
  x:number,
  y:number,
  width:number,
  height:number,
  state:number
}

export interface Line{
  id:number,
  x:Node|null,
  y:Switch|Source |null
}

//reponse json

export interface abstractNodes{
  id:number,
  type:string,
  x:number,
  y:number,
  state:number
}

export interface connections{
  id:number,
  sourceId:number,
  targetId:number
}

export interface MyResponse{
  abstractNodes:abstractNodes[],
  connections:connections[]
}

export interface longResponse{
  id:number
}
