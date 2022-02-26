// config our firebase
if (process.env.NODE_ENV === "debug") {
  setDebugLevel(1);
}
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { CleanPlugin } from "webpack";

const firebaseConfig = {
  apiKey: "AIzaSyD4NzapoXXPL4SmlxrbLOaFjku_W16wRWc",
  authDomain: "todoapp-firebase9.firebaseapp.com",
  projectId: "todoapp-firebase9",
  storageBucket: "todoapp-firebase9.appspot.com",
  messagingSenderId: "1019714534657",
  appId: "1:1019714534657:web:f2c4ea80ad17afc30daf00",
};

// Initialize Firebase
initializeApp(firebaseConfig);

// service i use
const db = getFirestore();

// collection refrence
const collRef = collection(db, "myTodos");

// -----------------------------------
// ----------------------------------------
const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("form submitted successfully");
  let todo = form.todo.value;
  // console.log(todo);
  // *****------- adding user todo into database----------************
  addDoc(collRef, {
    text: todo,
    status: "active",
  })
    .then(() => {
      console.log("item added successfully !");

      form.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});
// *****------- get user todo from database to console----------************
onSnapshot(collRef, (snapshot) => {
  let items = [];
  let countTodo = [];
  snapshot.docs.forEach((item) => {
    items.push({
      id: item.id,
      ...item.data(),
    });
    //console.log(items);
  });
  const generateItems = (items) => {
    let ic = -1;

    const todoItems = document.querySelector(".todo-items");
    let itemsHTML = "";
    // console.log(items);
    items.forEach((item) => {
      countTodo.push(item);
      itemsHTML += `
      
      <div class="todo-item new-todo ${
        item.status == "completed" ? "checked" : ""
      }">
        <div class="check">
          <div data-id="${item.id}" data-status="${
        item.status
      }" class="check-mark ${item.status == "completed" ? "checked" : ""}">
            <img src="../images/icon-check.svg" alt="tick" />
      </div>
      </div>
      <div class="todo-text todo-input ">
            <form>
            <input
            type="text"
            id="user-todo"
            value="${item.text}"
            class="${item.status == "completed" ? "checked" : ""}"
            readonly
            
            />
            </form>
            <div class="todo-hover-icons">
                <div class="edit-box">
                  <div class="edit-todo" data-count="${(ic += 1)}" data-iconid = "${
        item.id
      }">
                    <!-- edit icon -->
                  </div>
                  </div>
                <div class="delete-box">
                <div class="delete-todo" data-id="${item.id}">
                    <!-- delete-icon -->
                  </div>
                  </div>
                  </div>
                  </div>
                  </div>
                  
                  `;
    });
    todoItems.innerHTML = itemsHTML;

    // console.log(countTodo.length);
  };
  generateItems(items);

  const updateStatus = () => {
    const todoCheck = document.querySelectorAll(".todo-item .check-mark");
    todoCheck.forEach((check) => {
      check.addEventListener("click", () => {
        // console.log(check.getAttribute("data-id"));  // we get value via getAttribute() function
        let checkTodoId = check.dataset.id;
        let checkTodoStatus = check.dataset.status;
        // console.log(check.dataset.id); // we get value via dataset property in which we write after (data-) value in element.dataset.attributeName
        // console.log(check.dataset.status);
        const updateDocRef = doc(db, "myTodos", checkTodoId);
        if (checkTodoStatus == "active") {
          updateDoc(updateDocRef, {
            status: "completed",
          });
        } else {
          updateDoc(updateDocRef, {
            status: "active",
          });
        }
      });
    });
  };
  updateStatus();
  const deleteTodo = () => {
    const bins = document.querySelectorAll(".delete-todo");
    bins.forEach((bin) => {
      bin.addEventListener("click", () => {
        const checkDeleteTodo = bin.dataset.id;
        const deleteDocRef = doc(db, "myTodos", checkDeleteTodo);
        deleteDoc(deleteDocRef)
          .then(() => {
            console.log("Todo deleted successfully !");
          })
          .catch((err) => {
            console.log(err.message);
          });
      });
    });
  };
  deleteTodo();
  // edit our todo afer adding in todo items list
  const editTodo = () => {
    const inputs = document.querySelectorAll("#user-todo");
    const editIcons = document.querySelectorAll(".edit-todo");
    let todoInputs = [];
    inputs.forEach((input) => {
      todoInputs.push(input);
    });
    //console.log(todoInputs);
    editIcons.forEach((icon) => {
      icon.addEventListener("click", () => {
        let iconVal = icon.dataset.count;
        const input = todoInputs[Number(iconVal)];
        // console.log(input.value);

        if (icon.className == "edit-todo") {
          input.removeAttribute("readonly");
          input.focus();
          input.style.color = "red";
          input.style.backgroundColor = "#000";
          icon.className = "save-img";
        } else {
          input.style.color = "white";
          input.style.backgroundColor = "transparent";
          input.setAttribute("readonly", "readonly");
          const updatedTextVal = input.value;
          icon.className = "edit-todo";
          const textTodoId = icon.dataset.iconid;
          const updateTodoTextRef = doc(db, "myTodos", textTodoId);
          updateDoc(updateTodoTextRef, {
            text: updatedTextVal,
          });
        }
      });
    });
  };
  editTodo();
  // remaining items status
  const itemsLeft = (todoArray) => {
    const remainItems = todoArray.length;

    const rem_items = document.querySelector(".items-left");
    if (remainItems == 0) {
      rem_items.innerText = ` no items added `;
    } else {
      rem_items.innerHTML = ` <strong>${remainItems}</strong> items left `;
    }
  };
  itemsLeft(countTodo);
  //console.log(countTodo);
  // active items
  const updateDom = () => {
    const todoItems = document.querySelector(".todo-items");
    todoItems.innerHTML = " ";
  };
  const activeItems = () => {
    let active = [];
    const todoItems = document.querySelector(".todo-items");
    const activeBtn = document.getElementById("active");
    const allBtn = document.getElementById("all");
    const compBtn = document.getElementById("completed");

    activeBtn.classList.add("active");
    allBtn.classList.remove("active");
    compBtn.classList.remove("active");

    countTodo.forEach((items) => {
      if (items.status === "active") {
        active.push(items);
      }
    });
    //console.log(active);
    let itemsTodo = "";
    active.forEach((item) => {
      itemsTodo += `
          <div class="todo-item new-todo ${
            item.status == "completed" ? "checked" : ""
          }">
            <div class="check">
              <div data-id="${item.id}" data-status="${
        item.status
      }" class="check-mark ${item.status == "completed" ? "checked" : ""}">
                <img src="../images/icon-check.svg" alt="tick" />
          </div>
          </div>
          <div class="todo-text todo-input ">
                <form>
                <input
                type="text"
                id="user-todo"
                value="${item.text}"
                class="${item.status == "completed" ? "checked" : ""}"
                readonly
                
                />
                </form>

                      </div>
                      </div>
                      
                      `;
    });
    todoItems.innerHTML = itemsTodo;
  };
  //activeItems();
  const completedItems = () => {
    let completed = [];
    const todoItems = document.querySelector(".todo-items");
    const activeBtn = document.getElementById("active");
    const compBtn = document.getElementById("completed");
    const allBtn = document.getElementById("all");

    compBtn.classList.add("active");
    activeBtn.classList.remove("active");
    allBtn.classList.remove("active");

    countTodo.forEach((items) => {
      if (items.status === "completed") {
        completed.push(items);
      }
    });
    //console.log(completed);
    let itemsTodo = "";
    completed.forEach((item) => {
      itemsTodo += `
      <div class="todo-item new-todo ${
        item.status == "completed" ? "checked" : ""
      }">
            <div class="check">
            <div data-id="${item.id}" data-status="${
        item.status
      }" class="check-mark ${item.status == "completed" ? "checked" : ""}">
                <img src="../images/icon-check.svg" alt="tick" />
                </div>
                </div>
                <div class="todo-text todo-input ">
                <form>
                <input
                type="text"
                id="user-todo"
                value="${item.text}"
                class="${item.status == "completed" ? "checked" : ""}"
                readonly
                
                />
                </form>

                      </div>
                      </div>
                      
                      `;
    });
    todoItems.innerHTML = itemsTodo;
  };
  const allItems = () => {
    const todoItems = document.querySelector(".todo-items");
    const activeBtn = document.getElementById("active");
    const compBtn = document.getElementById("completed");
    const allBtn = document.getElementById("all");

    allBtn.classList.add("active");
    activeBtn.classList.remove("active");
    compBtn.classList.remove("active");
    let itemsTodo = "";
    let ic = -1;
    countTodo.forEach((item) => {
      itemsTodo += `
      <div class="todo-item new-todo ${
        item.status == "completed" ? "checked" : ""
      }">
      <div class="check">
      <div data-id="${item.id}" data-status="${
        item.status
      }" class="check-mark ${item.status == "completed" ? "checked" : ""}">
            <img src="../images/icon-check.svg" alt="tick" />
      </div>
      </div>
      <div class="todo-text todo-input ">
            <form>
            <input
            type="text"
            id="user-todo"
            value="${item.text}"
            class="${item.status == "completed" ? "checked" : ""}"
            readonly

            />
            </form>
            <div class="todo-hover-icons">
                <div class="edit-box">
                  <div class="edit-todo" data-count="${(ic += 1)}" data-iconid = "${
        item.id
      }">
                    <!-- edit icon -->
                  </div>
                  </div>
                <div class="delete-box">
                <div class="delete-todo" data-id="${item.id}">
                    <!-- delete-icon -->
                  </div>
                  </div>
                  </div>
                  </div>
                  </div>

                  `;
    });
    todoItems.innerHTML = itemsTodo;
  };
  // active button
  const activeBtn = document.getElementById("active");
  activeBtn.addEventListener("click", () => {
    updateDom();
    activeItems();
  });
  // Completed button
  const compBtn = document.getElementById("completed");
  compBtn.addEventListener("click", () => {
    updateDom();
    completedItems();
  });
  // All button
  const allBtn = document.getElementById("all");
  allBtn.addEventListener("click", () => {
    updateDom();
    allItems();
    updateStatus();
    deleteTodo();
    editTodo();
  });
});
