import { collection, addDoc, getDocs, Timestamp, query, orderBy, limit,  doc,
  deleteDoc , updateDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { db } from "./config.js"; 


const form = document.querySelector("#form")
const title = document.querySelector("#title")
const description = document.querySelector("#description")
const div = document.querySelector(".container")
const deleteBtn = document.querySelectorAll(".deleteBtn")
const edit = document.querySelectorAll(".editBtn")


let todoArr = []

async function getData(){
  const querySnapshot = await getDocs(collection(db, "todos"));
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
        <button class="deleteBtn">delete</button>
        <button class="editBtn">edit</button>
      </div>
     `
  })

  deleteBtn.forEach((item , index)=>{
    // console.log(item);
    item.addEventListener('click' , async (event)=>{
      // console.log("btn clicked");
      await deleteDoc(doc(db, "todos", todoArr[index].Id));
      todoArr.splice(index , 1)
      renderData(todoArr)
    })
   })

   edit.forEach((item , index)=>{
    // console.log(item);
    item.addEventListener('click' , async (event)=>{
      // console.log("btn clicked");
      const updateTitle = prompt("Enter updated title")

      const todoRef = doc(db, "todos", todoArr[index].Id);
      await updateDoc(todoRef, { 
        title: updateTitle
      });
      todoArr[index].title = updateTitle
      renderData(todoArr)
   })
})
}

getData()
renderData(todoArr)



form.addEventListener('submit' , async (event)=>{
  event.preventDefault();
  console.log(title.value);
  console.log(description.value);
     
try {
  const docRef = await addDoc(collection(db, "todos"), {
  title: title.value,
  description: description.value,
  dateExample: Timestamp.fromDate(new Date()),
});

  console.log("Document written with ID: ", docRef.id);

  const q = query(docRef, orderBy(dateExample, "desc"));
  todoArr.unshift({
    title: title.value,
    description: description.value,
    dateExample: Timestamp.fromDate(new Date()),
    Id: docRef.id,
  })
}
catch (e) {
  console.error("Error adding document: ", e);
}
})

