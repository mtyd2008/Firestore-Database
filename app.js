import { collection, addDoc, getDocs, Timestamp, query, orderBy, doc, deleteDoc , updateDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { db } from "./config.js"; 


const form = document.querySelector("#form")
const title = document.querySelector("#title")
const description = document.querySelector("#description")
const div = document.querySelector(".container")


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
        <button class="btn btn-danger delete">Delete</button>
        <button class="btn btn-info edit">Edit</button>
      </div>
     `
  })
  addEvntListnr()
}


function addEvntListnr(){
  document.querySelectorAll(".delete").forEach((btn , index)=>{
    btn.addEventListener('click' , async (Id)=>{
      // console.log('delete clicked');

      try {
        await deleteDoc(doc(db, "todos", todoArr[index].Id));
        todoArr.splice(index , 1)
        renderData(todoArr)

      } catch (error) {
        console.log(error); 
      }
    })
  })


  document.querySelectorAll(".edit").forEach((btn , index)=>{
    btn.addEventListener('click' , async (Id) => {
      console.log('edit clicked');
      
      try {
        const todoRef = doc(db, 'todos', todoArr[index].Id);
      const updatedTitle = prompt("enter updated title")
      await updateDoc(todoRef, {
        title: updatedTitle
      });
      todoArr[index].title = updatedTitle;
      renderData(todoArr)

      } catch (error) {
        console.log(error);
      }
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
