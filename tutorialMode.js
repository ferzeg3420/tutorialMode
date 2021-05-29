/* GLOBALS */

let indexOfCurrentTooltip = 0;
let indexOfCurrentElementToFocus = 0;
let savedZIndex = 0;

const HIDE_PREV_TOOLTIP_AFTER_FIRST = 1;
const BETWEEN_BLACK_AND_INVISIBLE_SCREENS = 98;
const FAIL_SAFE = 200;

function makeArrayOfElementsWithClassSeq(idPrefix) {
    const array = [];
    for( let i = 1; i < FAIL_SAFE; i++ ) {
        let nextElmn = idPrefix + i;
        let elmn = document.getElementsByClassName(nextElmn)[0];
        if( elmn == null ) {
            break;
        }
        array.push(elmn);
    }
    return array;
}

document.body.insertAdjacentHTML("beforeend", 
    '<div id="translucent-black-cover"\
          style="z-index: 1097"\
          class="covers-viewport translucid-black element-removed"></div>\
     <div id="invisible-cover"\
          style="z-index: 1099"\
          class="covers-viewport invisible element-removed"></div>\
     <div id="close-tutorial-button"\
          class="close-tutorial-button">\
         <div class="x-slash"></div>\
         <div class="x-back-slash"></div>\
     </div>\
     <div id="click-message"\
          style="z-index: 1098"\
          class="fixed-on-bottom-center element-removed">\
          <h4>Click anywhere to continue</h4>\
     </div>\
     <div id="tutorial-triangle"\
          class="element-removed"\
          style="position: absolute;\
                 top: -10px;\
                 left: 0;\
                 z-index: 1097;\
                 opacity: 0.9;\
                 width: 0;\
                 height: 0;\
                 border-left: 15px solid transparent;\
                 border-right: 15px solid transparent;\
                 border-bottom: 15px solid cornflowerblue;">'
);

/* REFS */

const infoTooltips = makeArrayOfElementsWithClassSeq("tutorial-text-");

const yesButton = document.getElementById("start-tutorial");
const noButton = document.getElementById("skip-tutorial");
const closeButton = document.getElementById("close-tutorial-button");
const triangle = document.getElementById("tutorial-triangle");

const startTutorialBox = document.getElementById("tutorial-modal");
const blackCover = document.getElementById("translucent-black-cover");
const invisibleCover = document.getElementById("invisible-cover");
const clickMessage = document.getElementById("click-message");

const thingsToFocusOn = makeArrayOfElementsWithClassSeq("tutorial-focus-");

/* FUNCTIONS */

function focusOnTutorialElement(currentTutorialElement) {
    return new Promise( resolve => {
        savedZIndex = currentTutorialElement.style.zIndex;
        currentTutorialElement.classList
                              .add("bring-between-black-and-invisible");
        resolve('resolved');
    });
}

function deFocusOnTutorialElement(tutorialElementToDefocus) {
    return new Promise( resolve => {
        tutorialElementToDefocus.classList
                                .remove("bring-between-black-and-invisible");
        resolve('resolved');
    });
}

function hidePreviousTooltip(tooltipToHide) {
    return new Promise( resolve => {
        tooltipToHide.classList.add("element-removed");
        resolve('resolved');
    });
}

function showCurrentTooltip(currentTooltip, currentTutorialElement) {
    return new Promise( resolve => {
        let currentTooltip = infoTooltips[indexOfCurrentTooltip];
        currentTooltip.classList.remove("element-removed");
        triangle.classList.remove("element-removed"); // removing so many times could be bad?

        let rect = currentTutorialElement.getBoundingClientRect();
        if( currentTooltip.classList.contains("tutorial-text-above") ) {
            let tooltipRect = currentTooltip.getBoundingClientRect();
            triangle.style.transform = "rotate(180deg)";
            triangle.style.top = String(rect.top - 20) + "px";
            triangle.style.left = String(rect.left + 14) + "px";
            currentTooltip.style.top = 
                String(rect.top - 20 - (tooltipRect.bottom - tooltipRect.top))
                + "px";
            currentTooltip.style.left = String(rect.left + 10) + "px";
            resolve('resolved');
            return;
        }
        triangle.style.top = String(rect.bottom + 5.5) + "px";
        triangle.style.left = String(rect.left + 14) + "px";
        currentTooltip.style.top = String(rect.bottom + 20) + "px";
        currentTooltip.style.left = String(rect.left + 10) + "px";
        resolve('resolved');
    });
}

async function goToNextTutorialSection() {
    let currentTutorialElement = thingsToFocusOn[indexOfCurrentElementToFocus];
    let currentTooltip = infoTooltips[indexOfCurrentTooltip];
    if( currentTutorialElement == null || currentTooltip == null ) {
        endTutorial();
    }
    await showCurrentTooltip(currentTooltip, currentTutorialElement);
    await focusOnTutorialElement(currentTutorialElement);
    indexOfCurrentTooltip++;
    indexOfCurrentElementToFocus++;
}

async function clearPreviousTutorialSection() {
    let tutorialElementToDefocus = 
        thingsToFocusOn[indexOfCurrentElementToFocus - 1];
    let tooltipToHide = infoTooltips[indexOfCurrentTooltip - 1];
    await deFocusOnTutorialElement(tutorialElementToDefocus);
    await hidePreviousTooltip(tooltipToHide);
}

function endTutorial() {
    indexOfCurrentTooltip = 0;

    yesButton.classList.add("element-removed");
    noButton.classList.add("element-removed");
    closeButton.classList.add("element-removed");
    startTutorialBox.classList.add("element-removed");
    blackCover.classList.add("element-removed");
    invisibleCover.classList.add("element-removed");
    clickMessage.classList.add("element-removed");
    triangle.classList.add("element-removed");

    for( let i = 0; i < infoTooltips.length; i++ ) {
        let elmn = infoTooltips[i];
        if( elmn === undefined ) {
            break;
        }
        infoTooltips[i].classList.add("element-removed");
    }
}

async function handleClickOnInvisibleCover(e) {
    if( indexOfCurrentTooltip >= infoTooltips.length ) {
        endTutorial();
    }
    else if( indexOfCurrentTooltip >= HIDE_PREV_TOOLTIP_AFTER_FIRST ) {
        clearPreviousTutorialSection();
        goToNextTutorialSection();
    }
    else { /* this branch is never taken but here just in case. */
        goToNextTutorialSection();
    }
}

function startTutorial(e) {
    // hide the tutorial dialog box
    startTutorialBox.classList.add("element-removed");

    // show the invisible cover and click message
    invisibleCover.classList.remove("element-removed");
    clickMessage.classList.remove("element-removed");

    goToNextTutorialSection();
}

/* LISTENERS */

yesButton.addEventListener("click", startTutorial);
noButton.addEventListener("click", endTutorial);
closeButton.addEventListener("click", endTutorial);
invisibleCover.addEventListener("click", handleClickOnInvisibleCover);

/* ACTIONS BEFORE RENDER */

blackCover.classList.remove("element-removed");
startTutorialBox.classList.remove("element-removed");
