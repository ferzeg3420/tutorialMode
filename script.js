/* GLOBALS */

let indexOfCurrentTooltip = 0;
let indexOfCurrentElementToFocus = 0;
let savedZIndex = 0;

const HIDE_PREV_TOOLTIP_AFTER_FIRST = 1;
const BETWEEN_BLACK_AND_INVISIBLE_SCREENS = 98;
const FAIL_SAFE = 200;

function makeArrayOfElementsWithIdSeq(idPrefix) {
    const array = [];
    for( let i = 1; i < FAIL_SAFE; i++ ) {
        let nextElmn = idPrefix + i;
        let elmn = document.getElementById(nextElmn);
        if( elmn === null ) {
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
          style="z-index: 1099"\
          class="fixed-on-bottom-center element-removed">\
          <h4>Click anywhere to continue</h4>\
     </div>'
);

/* REFS */

const infoTooltips = makeArrayOfElementsWithIdSeq("tutorial-text-");

const yesButton = document.getElementById("start-tutorial");
const noButton = document.getElementById("skip-tutorial");
const closeButton = document.getElementById("close-tutorial-button");

const startTutorialBox = document.getElementById("tutorial-modal");
const blackCover = document.getElementById("translucent-black-cover");
const invisibleCover = document.getElementById("invisible-cover");
const clickMessage = document.getElementById("click-message");

const thingsToFocusOn = makeArrayOfElementsWithIdSeq("tutorial-focus-");

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
        
        let rect = currentTutorialElement.getBoundingClientRect();
        currentTooltip.style.top = String(rect.bottom + 20) + "px";
        currentTooltip.style.left = String(rect.left + 10) + "px";
        console.log("--- left:", rect.left);
        console.log("--- bottom:", rect.bottom);

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

    for( let i = 0; i < infoTooltips.length; i++ ) {
        let elmn = infoTooltips[i];
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
