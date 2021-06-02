# Tutorial Mode

This is a utility I made for myself to be able to showcase my
webapps.  The goal is to make something that focuses on an element
in a webpage and shows a small tooltip underneath that explains
what that element is for. 

## Instructions

1. Include the script and style sheet into your project.

2. Get rid of the sample html in this repo.  Now copy the lines in
the following code block into your html page that needs the tutorial.
A good place for these lines would be at the end of your body
element.  You should get rid of the style tag and add your own
styling inside a class.

```
<div id="tutorial-modal" 
     style="z-index: 1098;
            position: fixed;
            left: 0;
            top: 0;
            height: 100vh;
            width: 100vw;
            display: flex;
            justify-content: center;
            align-items: center;"
     class="element-removed">
    <div style="background: whitesmoke;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                align-items: center;
                padding: 10px;
                min-height: 200px;
                min-width: 500px;
                border-radius: 5px;">
        <p>
            Quick tutorial?
        </p>
        <div class="buttons-div">
            <button id="start-tutorial">
                Yes
            </button>
            <button id="skip-tutorial">
                No, thanks
            </button>
        </div>
    </div>
</div>
```

What this does is create a dialogue box that prompts the user to
start the tutorial, and add the following id to it: `tutorial-modal`.
You also need a yes button with the following id `start-tutorial`
and a no button with the following id: `skip-tutorial`

4. Add a class of `tutorial-focus-1` to the element that you want
to focus on first. And a matching class to the tooltip with class
`tutorial-text-1` that you want to be shown. The tooltips also need
the classes `tutorial-text` and `element-removed`.

5. Repeat previous step with the next number in the sequence
`tutorial-focus-2`, `tutorial-focus-3` and so on. Same for the
`tutorial text-`. Remember that it starts at 1 instead of 0.
