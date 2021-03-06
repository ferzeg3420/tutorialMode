/* FUNCTIONS */

function enableTutorialMode() {
    let indexOfCurrentTooltip = 0;
    let indexOfCurrentElementToFocus = 0;
    let savedZIndex = 0;
    
    const HIDE_PREV_TOOLTIP_AFTER_FIRST = 1;
    const BETWEEN_BLACK_AND_INVISIBLE_SCREENS = 98;
    const IS_ABOVE_VIEWPORT = 0;
    const HEIGHT_OF_CLICK_MESSAGE = 50;
    
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
    
    function positionTooltipElements(tooltip,
                                     tooltipRect,
                                     triangle, 
                                     focusedElementRect)
    {
        // Need amount user scrolled because rects are viewport-relative
        let yOffset = window.pageYOffset;
        let xOffset = window.pageXOffset;

        // Triangle position values
        let triangleTopPos = focusedElementRect.bottom + yOffset + 5.5
        triangle.style.transform = "rotate(0deg)";
        if( tooltip.classList.contains("tutorial-text-above") ) {
            triangleTopPos =
                focusedElementRect.top + yOffset - 20;
            triangle.style.transform = "rotate(180deg)";
        }
        let triangleLeftPos = focusedElementRect.left + xOffset + 14

        // Tooltip position values
        let tooltipTopPos = focusedElementRect.bottom + yOffset + 20;
        if( tooltip.classList.contains("tutorial-text-above") ) {
            let tooltipHeight = tooltipRect.bottom - tooltipRect.top;
            tooltipTopPos =
                focusedElementRect.top + yOffset - 20 - tooltipHeight;
        }
        let tooltipLeftPos = focusedElementRect.left + xOffset + 10;

        triangle.style.top = String(triangleTopPos) + "px";
        triangle.style.left = String(triangleLeftPos) + "px";
        tooltip.style.top = String(tooltipTopPos) + "px";
        tooltip.style.left = String(tooltipLeftPos) + "px";
    }
    
    function showCurrentTooltip(currentTooltip,
                                currentTutorialElement,
                                triangle) {
        return new Promise( resolve => {
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

    function scrollIfNecessary(currentTooltip,
                               currentTutorialElement) {
        return new Promise( resolve => {
            let tooltipRect = currentTooltip.getBoundingClientRect();
            let focusedElementRect = 
                currentTutorialElement.getBoundingClientRect();
            let uppermostElement =
                Math.min(tooltipRect.top, focusedElementRect.top);
            if( uppermostElement < IS_ABOVE_VIEWPORT ) {
                // scroll the screen up
                window.scrollBy(0, uppermostElement);
            }
            const isBelowViewport = 
                window.innerHeight - HEIGHT_OF_CLICK_MESSAGE;
            let lowermostElement =
                Math.max(tooltipRect.bottom, focusedElementRect.bottom);
            if( lowermostElement > isBelowViewport ) {
                // scroll the screen down
                const scrollDownAmount = 
                    lowermostElement 
                        - window.innerHeight 
                        + HEIGHT_OF_CLICK_MESSAGE;
                window.scrollBy(0, scrollDownAmount);
            }
            resolve('resolved');
            return;
        });
    }
    
    async function goToNextTutorialSection(tutorialControls) {
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
            endTutorial(null, tutorialControls);
        }
        await showCurrentTooltip(currentTooltip, 
                                 currentTutorialElement,
                                 triangle);
        await focusOnTutorialElement(currentTutorialElement);
        await scrollIfNecessary(currentTooltip, currentTutorialElement);
        indexOfCurrentTooltip++;
        indexOfCurrentElementToFocus++;
    }
    
    async function clearPreviousTutorialSection(thingsToFocusOn,
                                                infoTooltips) {
        let tutorialElementToDefocus = 
            thingsToFocusOn[indexOfCurrentElementToFocus - 1];
        let tooltipToHide = infoTooltips[indexOfCurrentTooltip - 1];
        await deFocusOnTutorialElement(tutorialElementToDefocus);
        await hidePreviousTooltip(tooltipToHide);
    }
    
    function endTutorial(e, tutorialControls) {
        indexOfCurrentTooltip = 0;
    
        // Check if do not show is checked
        let doNotShowCheckbox = document.getElementById("no-show-again");
        if( doNotShowCheckbox.checked ) {
            localStorage.setItem('doNotShowTutorial', 'true');
        }
    
        tutorialControls.tutorialPromptControls
                        .yesButton
                        .classList.add("element-removed");
        tutorialControls
            .tutorialPromptControls
            .yesButton
            .removeEventListener("click", yesListener);

        tutorialControls.tutorialPromptControls
                        .noButton
                        .classList.add("element-removed");
        tutorialControls
            .tutorialPromptControls
            .noButton
            .removeEventListener("click", noTutorialListener);

        tutorialControls.tutorialPromptControls
                        .closeButton
                        .classList.add("element-removed");
        tutorialControls
            .tutorialPromptControls
            .closeButton
            .removeEventListener("click", closeListener );

        tutorialControls.tutorialPromptControls
                        .startTutorialBox
                        .classList.add("element-removed");

        tutorialControls.tutorialPromptControls
                        .blackCover
                        .classList.add("element-removed");

        tutorialControls.tutorialPromptControls
                        .invisibleCover
                        .classList.add("element-removed");
        tutorialControls
            .tutorialPromptControls
            .invisibleCover
            .removeEventListener("click", coverClickListener);

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
            infoTooltips[i] = null;
        }
        infoTooltips = null;

        let thingsToFocusOn = 
            tutorialControls.tooltipControls.thingsToFocusOn;
        for( let i = 0; i < thingsToFocusOn.length; i++ ) {
            let elmn = thingsToFocusOn[i];
            if( elmn === undefined ) {
                break;
            }
            thingsToFocusOn[i] = null;
        }
        thingsToFocusOn = null;
    }
    
    async function handleClickOnInvisibleCover(e, tutorialControls) {
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
        // Check if do not show is checked
        let doNotShowCheckbox = document.getElementById("no-show-again");
        if( doNotShowCheckbox.checked ) {
            localStorage.setItem('doNotShowTutorial', 'true');
        }
    
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
    
        goToNextTutorialSection(tutorialControls);
    }
    
    function makeArrayOfElementsWithClassSeq(idPrefix) {
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
        return new Promise( resolve => {
            document.body.insertAdjacentHTML("beforeend", 
                '<div id="translucent-black-cover"\
                      style="z-index: 1097"\
                      class="covers-viewport translucid-black element-removed">\
                 </div>\
                 <div id="invisible-cover"\
                      style="z-index: 1099;\
                             height: 100vh;\
                             width: 100vw;\
                             position: fixed;\
                             top: 0;\
                             opacity: 1;\
                             background: transparent;\
                             left: 0;"\
                      class="element-removed"></div>\
                 <div id="close-tutorial-button"\
                      class="close-tutorial-button">\
                     <div class="x-slash"></div>\
                     <div class="x-back-slash"></div>\
                 </div>\
                 <div id="click-message"\
                      style="z-index: 1098;\
                             position: fixed;\
                             bottom: 20px;\
                             font-size: 20px;\
                             width: 100%;\
                             display: flex;\
                             flex-direction: row;\
                             justify-content: center;\
                             align-items: center;\
                             color: grey;"\
                      class="element-removed">\
                      Click anywhere to continue\
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
        await insertTutorialElementsIntoDOM();
        let tutorialPromptControls = await getTutorialPromptControls();
        let tooltipControls = await getTooltipControls();
        return {
            "tutorialPromptControls": tutorialPromptControls, 
            "tooltipControls": tooltipControls
        };
    }

    var yesListener = null;
    var noTutorialListener = null;
    var closeListener = null;
    var coverClickListener = null;
 
    (async () => {
        if( localStorage.getItem("doNotShowTutorial") == "true" ) {
            return;
        }
        const tutorialControls = await insertTutorialAndGetTutorialControls();

        yesListener = function(e) {
            startTutorial(e, tutorialControls);
        }

        noTutorialListener = function (e) {
            endTutorial(e, tutorialControls);
        }

        closeListener = function (e) {
            endTutorial(e, tutorialControls);
        }

        coverClickListener = function (e) { 
            handleClickOnInvisibleCover(e, tutorialControls);
        }

        tutorialControls
            .tutorialPromptControls
            .yesButton
            .addEventListener("click", yesListener);
        
        tutorialControls
            .tutorialPromptControls
            .noButton
            .addEventListener("click", noTutorialListener);
        
        tutorialControls
            .tutorialPromptControls
            .closeButton
            .addEventListener("click", closeListener);
        
        tutorialControls
            .tutorialPromptControls
            .invisibleCover
            .addEventListener("click", coverClickListener);
        
        tutorialControls.tutorialPromptControls
                        .blackCover
                        .classList
                        .remove("element-removed");

        tutorialControls.tutorialPromptControls
                        .startTutorialBox
                        .classList
                        .remove("element-removed");
    })();
}
//enableTutorialMode();
