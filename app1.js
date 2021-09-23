const selectors = {
  ulId: "#list",
  mealId: "#meal",
  caloriesId: "#calories",
  totalId: "#total",
  clearId: "#clear",
  addBtnId: "#addBtn",
  updateBtnId: "#updateBtn",
  deleteBtnId: "#deleteBtn",
  backBtnId: "#back",
  editId: ".editBtn",
};

// Storage Controller
class StorageController {
  //Gets items fron LS
  static getItemsFromStorage() {
    let items;
    if (localStorage.getItem("items") === null) {
      items = [];
    } else {
      items = JSON.parse(localStorage.getItem("items"));
    }
    return items;
  }

  static addItemLS(item) {
    let items;
    if (localStorage.getItem("items") === null) {
      items = [];
      items.push(item);
      localStorage.setItem("items", JSON.stringify(items));
    } else {
      items = JSON.parse(localStorage.getItem("items"));
      items.push(item);
      localStorage.setItem("items", JSON.stringify(items));
    }
  }

  //Delete items from LS
  static deleteFromLS(id) {
    let items = StorageController.getItemsFromStorage();
    items.forEach((item) => {
      if (item.id === id) {
        items.splice(item.id, 1);
      }
    });
    items.forEach((item, index) => {
      item.id = index;
    });
    localStorage.setItem("items", JSON.stringify(items));
  }

  //Updating items from LS
  static updateItemFromLS(updatedItem) {
    let items = StorageController.getItemsFromStorage();
    items.forEach((item) => {
      if (item.id === updatedItem.id) {
        items.splice(item.id, 1, updatedItem);
      }
    });
    localStorage.setItem("items", JSON.stringify(items));
  }

  //Delete all from LS
  static deleteAllFromLS() {
    localStorage.removeItem("items");
  }
}

// End LocalStorage Controller
// ==========================

const data = {
  items: StorageController.getItemsFromStorage(),
  totalCalories: 0,
  currentItem: null,
};

//Controlador de Items
class ItemsController {
  constructor(id, meal, calories) {
    this.id = id;
    this.meal = meal;
    this.calories = calories;
  }

  //Add method
  static addItem(meal, calories) {
    calories = parseInt(calories);
    //Ids
    let id;
    if (data.items.length > 0) {
      id = data.items[data.items.length - 1].id + 1;
    } else {
      id = 0;
    }

    const newItem = new ItemsController(id, meal, calories);
    data.items.push(newItem);
    return newItem;
  }

  //Sum Calories
  static sumCalories() {
    let totalCalories = 0;
    data.items.forEach((item) => (totalCalories += item.calories));
    data.totalCalories = totalCalories;
  }

  //Find Item by Id
  static findItemById(id) {
    let foundItem = null;
    data.items.forEach((item) => {
      if (item.id === id) {
        foundItem = item;
      }
    });
    return foundItem;
  }

  //Set and get current Item
  static currentItem(item) {
    data.currentItem = item;
  }

  //update item
  static updateItem(meal, calories) {
    calories = parseInt(calories);

    data.items.forEach((item) => {
      if (item.id === data.currentItem.id) {
        item.meal = meal;
        item.calories = calories;
      }
    });
  }

  //delete item from data object
  static deleteItemfromData(item) {
    data.items.forEach((x) => {
      if (x.id === item.id) {
        data.items.splice(x.id, 1);
      }
    });
  }

  static;
}

// Ends ItemsController
// ===================

//UI Controller
class UIController {
  //Showing List Items
  static showItemsList(items) {
    let list = "";
    items.forEach((item) => {
      list += `<li id="item-${item.id}">${item.meal} - ${item.calories} cal <a href="#" class="editBtn"><i class="fas fa-pen"></i></a></li>`;
    });
    document.querySelector(selectors.ulId).innerHTML = list;
  }

  //Get items from form
  static getItemFromUI() {
    return {
      meal: document.querySelector(selectors.mealId).value,
      calories: document.querySelector(selectors.caloriesId).value,
    };
  }

  //Clean Inputs
  static cleanInputs() {
    document.querySelector(selectors.mealId).value = "";
    document.querySelector(selectors.caloriesId).value = "";
  }

  //Add Items In The List
  static addItemToList(item) {
    const li = document.createElement("li");
    li.innerHTML = `${item.meal} - ${item.calories} cal <a href="#" class="editBtn"><i class="fas fa-pen"></i></a>`;
    li.id = `item-${item.id}`;
    document.querySelector(selectors.ulId).appendChild(li);
  }

  //show total calories
  static showTotalCalories(totalCalories) {
    document.querySelector(selectors.totalId).textContent = totalCalories;
  }

  //add item in form for edit
  static fillForm(id) {
    document.querySelector(selectors.mealId).value =
      ItemsController.findItemById(id).meal;
    document.querySelector(selectors.caloriesId).value =
      ItemsController.findItemById(id).calories;
    const updateId = id;

    return updateId;
  }

  // Show InitialState
  static initialState() {
    document.querySelector(selectors.addBtnId).style.display = "inline";
    document.querySelector(selectors.clearId).style.display = "inline";
    document.querySelector(selectors.updateBtnId).style.display = "none";
    document.querySelector(selectors.deleteBtnId).style.display = "none";
    document.querySelector(selectors.backBtnId).style.display = "none";
  }

  // Show EditState
  static editState() {
    document.querySelector(selectors.addBtnId).style.display = "none";
    document.querySelector(selectors.clearId).style.display = "none";
    document.querySelector(selectors.updateBtnId).style.display = "inline";
    document.querySelector(selectors.deleteBtnId).style.display = "inline";
    document.querySelector(selectors.backBtnId).style.display = "inline";
  }

  //Delete item from IU
  static deleteFromUI(id) {
    const itemId = `#item-${id}`;
    const itemDelete = document.querySelector(itemId);
    itemDelete.remove();
  }

  //update Item from UI
  static updateItemUI(item) {
    const itemsList = document.querySelectorAll("li");

    itemsList.forEach((itemList) => {
      const itemListId = itemList.getAttribute("id");
      if (itemListId === `item-${item.id}`) {
        document.querySelector(
          `#${itemListId}`
        ).innerHTML = `${item.meal} - ${item.calories} cal <a href="#" class="editBtn"><i class="fas fa-pen"></i></a>`;
      }
    });
  }

  //Delete all From UI
  static deleteAllFromUI() {
    document.querySelector(selectors.clearId).addEventListener("click", () => {
      StorageController.deleteAllFromLS();
    });
  }
}

// Ends UIController
// ===================

//Events Controller
class EventsController {
  static events(selector, eventType, funct) {
    document.querySelector(selector).addEventListener(eventType, funct);
  }
}

class ButtonsActions {
  static initialState() {
    UIController.showItemsList(data.items);
    ItemsController.sumCalories();
    UIController.showTotalCalories(data.totalCalories);
    UIController.initialState();
  }
  static itemAddSubmit(e) {
    e.preventDefault();
    const newItem = UIController.getItemFromUI();
    if (newItem.meal !== "" && newItem.calories !== "") {
      const item = ItemsController.addItem(newItem.meal, newItem.calories);
      StorageController.addItemLS(item);
      UIController.cleanInputs();
      UIController.showItemsList(data.items);
      ItemsController.sumCalories();
      UIController.showTotalCalories(data.totalCalories);
    } else {
      Swal.fire("You need to enter the data!");
    }
  }

  static itemEditSubmit(e) {
    if (e.target.classList.contains("fa-pen")) {
      UIController.editState();
      const itemId = e.target.parentElement.parentElement
        .getAttribute("id")
        .split("-")[1];
      const id = parseInt(itemId);
      UIController.fillForm(id);
      const itemToEdit = ItemsController.findItemById(id);
      ItemsController.currentItem(itemToEdit);
    }

    e.preventDefault();
  }

  static itemUpdateSubmit(e) {
    const updatedItem = UIController.getItemFromUI();

    if (updatedItem.meal !== "" && updatedItem.calories !== "") {
      UIController.cleanInputs();
      ItemsController.updateItem(updatedItem.meal, updatedItem.calories);
      console.log(data.currentItem);
      StorageController.updateItemFromLS(data.currentItem);
      console.log(data.currentItem);
      UIController.updateItemUI(data.currentItem);
      ItemsController.sumCalories();
      UIController.showTotalCalories(data.totalCalories);
      UIController.initialState();
    } else {
      Swal.fire("You need to fill in the form");
    }
    e.preventDefault();
  }

  static itemDeleteSubmit(e) {
    e.preventDefault();

    Swal.fire({
      title: "Do you want to delete this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "Your item has been deleted.", "success");
        UIController.deleteFromUI(data.currentItem.id);
        ItemsController.deleteItemfromData(data.currentItem);
        StorageController.deleteFromLS(data.currentItem.id);
        UIController.cleanInputs();
        ItemsController.sumCalories();
        UIController.showTotalCalories(data.totalCalories);
        UIController.initialState();
      }
    });
  }

  static itemBackSubmit(e) {
    UIController.cleanInputs();
    UIController.initialState();
  }

  static itemClearSubmit(e) {
    e.preventDefault();

    if (!data.items.length) {
      Swal.fire("There is nothing to delete");
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Deleted!", "Your data has been deleted.", "success");
          UIController.deleteAllFromUI();
          StorageController.deleteAllFromLS();
          data.items = [];
          data.totalCalories = 0;
          UIController.showItemsList(data.items);
          UIController.showTotalCalories(data.totalCalories);
        }
      });
    }
  }
}

//Controlador de la aplicacion
class App {
  static run() {
    ButtonsActions.initialState();
    EventsController.events(
      selectors.addBtnId,
      "click",
      ButtonsActions.itemAddSubmit
    );
    EventsController.events(
      selectors.ulId,
      "click",
      ButtonsActions.itemEditSubmit
    );
    EventsController.events(
      selectors.updateBtnId,
      "click",
      ButtonsActions.itemUpdateSubmit
    );
    EventsController.events(
      selectors.deleteBtnId,
      "click",
      ButtonsActions.itemDeleteSubmit
    );
    EventsController.events(
      selectors.backBtnId,
      "click",
      ButtonsActions.itemBackSubmit
    );
    EventsController.events(
      selectors.clearId,
      "click",
      ButtonsActions.itemClearSubmit
    );
  }
}

App.run();
