/* FUNCTIONS */

let indexOfCurrentTooltip = 0;
let indexOfCurrentElementToFocus = 0;
let savedZIndex = 0;

const HIDE_PREV_TOOLTIP_AFTER_FIRST = 1;
const BETWEEN_BLACK_AND_INVISIBLE_SCREENS = 98;

function focusOnTutorialElement(currentTutorialElement) {
    console.log("---> focusOnTutorialElement");
    return new Promise( resolve => {
        savedZIndex = currentTutorialElement.style.zIndex;
        currentTutorialElement.classList
                              .add("bring-between-black-and-invisible");
        resolve('resolved');
    });
}

function deFocusOnTutorialElement(tutorialElementToDefocus) {
    console.log("---> deFocusOnTutorialElement");
    return new Promise( resolve => {
        tutorialElementToDefocus.classList
            .remove("bring-between-black-and-invisible");
        resolve('resolved');
    });
}

function hidePreviousTooltip(tooltipToHide) {
    console.log("---> hidePreviousTooltip");
    return new Promise( resolve => {
        tooltipToHide.classList.add("element-removed");
        resolve('resolved');
    });
}

function positionTooltipElements(tooltip,
                                 tooltipRect,
                                 triangle, 
                                 focusedElementRect)
{
    console.log("---> positionTooltipElements");
    if( tooltip.classList.contains("tutorial-text-above") ) {
        triangle.style.transform = "rotate(180deg)";
        triangle.style.top = String(focusedElementRect.top - 20) + "px";
        triangle.style.left = String(focusedElementRect.left + 14) + "px";
        let tooltipHeight = tooltipRect.bottom - tooltipRect.top;
        tooltip.style.top =
            String(focusedElementRect.top - 20 - tooltipHeight) + "px";
        tooltip.style.left =
            String(focusedElementRect.left + 10) + "px";
        return;
    }
    triangle.style.top = String(focusedElementRect.bottom + 5.5) + "px";
    triangle.style.left = String(focusedElementRect.left + 14) + "px";
    tooltip.style.top = String(focusedElementRect.bottom + 20) + "px";
    tooltip.style.left = String(focusedElementRect.left + 10) + "px";
}

function showCurrentTooltip(currentTooltip,
                            currentTutorialElement,
                            triangle,
                            infoTooltips) {
    console.log("---> showCurrentTooltip");
    return new Promise( resolve => {
        let currentTooltip = infoTooltips[indexOfCurrentTooltip];
        currentTooltip.classList.remove("element-removed");
        triangle.classList.remove("element-removed");
        let tooltipRect = currentTooltip.getBoundingClientRect();
        let focusedElementRect = 
            currentTutorialElement.getBoundingClientRect();
        positionTooltipElements( currentTooltip,
                                 tooltipRect,
                                 triangle, 
                                 focusedElementRect);
        resolve('resolved');
        return;
    });
}

async function goToNextTutorialSection(tutorialControls) {
    console.log("---> goToNextTutorialSection");
    let thingsToFocusOn =
        tutorialControls.tooltipControls.thingsToFocusOn;
    let infoTooltips = 
        tutorialControls.tooltipControls.infoTooltips;
    let currentTutorialElement = 
        thingsToFocusOn[indexOfCurrentElementToFocus];
    let currentTooltip = infoTooltips[indexOfCurrentTooltip];
    let triangle = 
        tutorialControls.tooltipControls.triangle;

    if( currentTutorialElement == null || currentTooltip == null ) {
        console.log(">>>> goToNextTutorialSection: 97: endTutorial()");
        endTutorial(null, tutorialControls);
    }
    await showCurrentTooltip(currentTooltip, 
                             currentTutorialElement,
                             triangle,
                             infoTooltips);
    await focusOnTutorialElement(currentTutorialElement);
    indexOfCurrentTooltip++;
    indexOfCurrentElementToFocus++;
}

async function clearPreviousTutorialSection(thingsToFocusOn,
                                            infoTooltips) {
    console.log("---> clearPreviousTutorialSection");
    let tutorialElementToDefocus = 
        thingsToFocusOn[indexOfCurrentElementToFocus - 1];
    let tooltipToHide = infoTooltips[indexOfCurrentTooltip - 1];
    await deFocusOnTutorialElement(tutorialElementToDefocus);
    await hidePreviousTooltip(tooltipToHide);
}

function endTutorial(e, tutorialControls) {
    console.log("---> endTutorial");
    indexOfCurrentTooltip = 0;

    tutorialControls.tutorialPromptControls
                    .yesButton
                    .classList.add("element-removed");
    tutorialControls.tutorialPromptControls
                    .noButton
                    .classList.add("element-removed");
    tutorialControls.tutorialPromptControls
                    .closeButton
                    .classList.add("element-removed");
    tutorialControls.tutorialPromptControls
                    .startTutorialBox
                    .classList.add("element-removed");
    tutorialControls.tutorialPromptControls
                    .blackCover
                    .classList.add("element-removed");
    tutorialControls.tutorialPromptControls
                    .invisibleCover
                    .classList.add("element-removed");
    tutorialControls.tutorialPromptControls
                    .clickMessage
                    .classList.add("element-removed");
    tutorialControls.tooltipControls
                    .triangle
                    .classList.add("element-removed");

    let infoTooltips = 
        tutorialControls.tooltipControls.infoTooltips;

    for( let i = 0; i < infoTooltips.length; i++ ) {
        let elmn = infoTooltips[i];
        if( elmn === undefined ) {
            break;
        }
        infoTooltips[i].classList.add("element-removed");
    }
}

async function handleClickOnInvisibleCover(e, tutorialControls) {
    console.log("---> handleClickOnInvisibleCover");
    let infoTooltips =
        tutorialControls.tooltipControls.infoTooltips;
    let thingsToFocusOn =
        tutorialControls.tooltipControls.thingsToFocusOn;

    if( indexOfCurrentTooltip >= infoTooltips.length ) {
        endTutorial(null, tutorialControls);
    }
    else if( indexOfCurrentTooltip >= HIDE_PREV_TOOLTIP_AFTER_FIRST ) {
        clearPreviousTutorialSection(thingsToFocusOn, infoTooltips);
        goToNextTutorialSection(tutorialControls);
    }
    else { /* this branch is never taken but here just in case. */
        goToNextTutorialSection(tutorialControls);
    }
}

function startTutorial(e, tutorialControls) {
    console.log("---> startTutorial");
    // hide the tutorial dialog box
    tutorialControls.tutorialPromptControls
                    .startTutorialBox
                    .classList
                    .add("element-removed");

    // show the invisible cover and click message
    tutorialControls.tutorialPromptControls
                    .invisibleCover
                    .classList
                    .remove("element-removed");
    tutorialControls.tutorialPromptControls
                    .clickMessage
                    .classList
                    .remove("element-removed");

    console.log("---> startTutorial: 196 going to next tutorial");
    goToNextTutorialSection(tutorialControls);
}

function makeArrayOfElementsWithClassSeq(idPrefix) {
    console.log("---> makeArrayOfElementsWithClassSeq, idPrefix", idPrefix);
    const array = [];
    let i = 1;
    while( true ) {
        let nextElmn = idPrefix + i;
        let elmn = document.getElementsByClassName(nextElmn)[0];
        if( elmn == null ) {
            break;
        }
        array.push(elmn);
        i++;
    }
    return array;
}

function insertTutorialElementsIntoDOM() {
    console.log("---> insertTutorialElementsIntoDOM");
    return new Promise( resolve => {
        document.body.insertAdjacentHTML("beforeend", 
            '<div id="translucent-black-cover"\
                  style="z-index: 1097"\
                  class="covers-viewport translucid-black element-removed">\
             </div>\
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
        resolve("resolved");
    });
}

function getTutorialPromptControls() {
    return new Promise( resolve => { 
        console.log("---> getTutorialPromptControls");
        const startTutorialBox = document.getElementById("tutorial-modal");
        const yesButton = document.getElementById("start-tutorial");
        const noButton = document.getElementById("skip-tutorial");
        const closeButton = 
            document.getElementById("close-tutorial-button");

        const blackCover =
            document.getElementById("translucent-black-cover");
        const invisibleCover = document.getElementById("invisible-cover");
        const clickMessage = document.getElementById("click-message");

        resolve ({ 
            "startTutorialBox": startTutorialBox,
            "yesButton": yesButton,
            "noButton": noButton,
            "closeButton": closeButton,
            "blackCover": blackCover,
            "invisibleCover": invisibleCover,
            "clickMessage": clickMessage
        });
    });
}

function getTooltipControls() {
    return new Promise( resolve => {
        console.log("---> getTooltipControls");
        const infoTooltips =
            makeArrayOfElementsWithClassSeq("tutorial-text-");
        const thingsToFocusOn =
            makeArrayOfElementsWithClassSeq("tutorial-focus-");
        const triangle =
            document.getElementById("tutorial-triangle");
  
        resolve( {
            "infoTooltips": infoTooltips,
            "thingsToFocusOn": thingsToFocusOn,
            "triangle": triangle
        });
    });
}

async function insertTutorialAndGetTutorialControls() {
    console.log("---> insertTutorialAndGetTutorialControls");
    await insertTutorialElementsIntoDOM();
    let tutorialPromptControls = await getTutorialPromptControls();
    let tooltipControls = await getTooltipControls();
    return {
        "tutorialPromptControls": tutorialPromptControls, 
        "tooltipControls": tooltipControls
    };
}

(async () => {
    const tutorialControls = await insertTutorialAndGetTutorialControls();
    console.log("---> tutorialControls:", tutorialControls);
    tutorialControls.tutorialPromptControls
                    .yesButton
                    .addEventListener("click", 
                                      (e) => startTutorial(e, 
                                                           tutorialControls));
    
    tutorialControls.tutorialPromptControls
                    .noButton
                    .addEventListener("click",
                                      (e) => endTutorial(e, tutorialControls));
    
    tutorialControls.tutorialPromptControls
                    .closeButton
                    .addEventListener("click", 
                                      (e) => endTutorial(e, tutorialControls));
    
    tutorialControls.tutorialPromptControls
                    .invisibleCover
                    .addEventListener("click", 
                                      (e) => handleClickOnInvisibleCover(
                                              e,
                                              tutorialControls 
                                          ));
    
    /* ACTIONS BEFORE RENDER */
    
    tutorialControls.tutorialPromptControls
                    .blackCover
                    .classList
                    .remove("element-removed");
    tutorialControls.tutorialPromptControls
                    .startTutorialBox
                    .classList
                    .remove("element-removed");
})();


