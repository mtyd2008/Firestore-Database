import { collection, addDoc, getDocs, Timestamp, query, orderBy, doc, deleteDoc , updateDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { db } from "./config.js"; 


const form = document.querySelector("#form")
const title = document.querySelector("#title")
const description = document.querySelector("#description")
const div = document.querySelector(".container")
const del = document.querySelectorAll("#delete")
const edt = document.querySelectorAll("#edit")



let todoArr = []

async function getDatafromfirestore(){
  todoArr.length = 0 
  const q = query(collection(db , "todos"), orderBy('todoDate', "desc"));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // console.log(`${doc.id} => ${doc.data()}`);
    todoArr.push({...doc.data() , Id: doc.id})
    renderData(todoArr)
});
}
console.log(todoArr);

function renderData(arr){
  div.innerHTML = ''

  arr.map((item)=>{
    div.innerHTML += `
      <div class="box">
        <p>Title: ${item.title}</p>
        <p>Description: ${item.description}</p>
        <button id="delete" class="btn btn-danger">Delete</button>
        <button id="edit" class="btn btn-info">Edit</button>
      </div>
     `
  })

  del.forEach((btn , index)=>{
    btn.addEventListener('click' , async (Id)=>{
      console.log("del click" , index);
    
        await deleteDoc(doc(db, "todos", todoArr[index].Id));
        todoArr.splice(index , 1)
        renderData()
    })
  })
  
  edt.forEach((btn , index)=>{
    btn.addEventListener('click' , async (Id)=>{
      console.log("edt click" , index);
      const todoRef = doc(db, 'todos', todoArr[index].Id);
      const updatedTitle = prompt("enter updated title")

      await updateDoc(todoRef, {
        title: updatedTitle
    });
       renderData()
    })
  })

}

getDatafromfirestore()
renderData(todoArr)



form.addEventListener('submit' , async (event)=>{
  event.preventDefault();
  console.log(title.value);
  console.log(description.value);
     
try {
  const docRef = await addDoc(collection(db, "todos"), {
  title: title.value,
  description: description.value,
  todoDate: Timestamp.fromDate(new Date()),
});

  console.log("Document written with ID: ", docRef.id);
  getDatafromfirestore()
}
catch (e) {
  console.error("Error adding document: ", e);
}

title.value = ''
description.value = ''
})

