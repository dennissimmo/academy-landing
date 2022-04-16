console.log('script updated');
// Functionality 
import { menuInit } from "./files/functions.js";
import { addTouchClass } from "./files/functions.js";

// Add touch 
addTouchClass();


// Burger menu
menuInit();

// Work with scroll
import * as flScroll from "./files/scroll/scroll.js";
flScroll.headerScroll();

// 

// Popup 
import './libs/popup.js'
