import { collection, addDoc, getDocs, Timestamp} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { db } from "./config.js"; 


const form = document.querySelector("#form")
const title = document.querySelector("#title")
const description = document.querySelector("#description")
const div = document.querySelector(".container")

let arr = []

async function getData(){
    const querySnapshot = await getDocs(collection(db, "todos"));
    querySnapshot.forEach((doc) => {
      arr.push(doc.data())
    });
    
}
console.log(arr);

arr.map((item)=>{
    div.innerHTML += `<div class="box">
      <p><h1>Title</h1>:${item.title}</p>
      <p><h1>Description</h1>:${item.description}</p>
     </div>`
})


getData()



form.addEventListener('submit' , async (event)=>{
    event.preventDefault();
    div.innerHTML = ''
    console.log(title.value);
    console.log(description.value);
     
    try {
        const docRef = await addDoc(collection(db, "todos"), {
          title: title.value,
          description: description.value,
          dateExample: Timestamp.fromDate(new Date()),

        });

        console.log("Document written with ID: ", docRef.id);

      } catch (e) {
        console.error("Error adding document: ", e);
      }


})


