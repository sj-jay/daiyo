gsap.registerPlugin(Observer);
gsap.registerPlugin(ScrollTrigger);




let current = 0;
let currentIndex = 0;
let nextIndex = 0;
let index = 0;
let animating = false;


// create array with all sections
const sections = gsap.utils.toArray("section");
const wd = document.getElementById("whiteDoor");
const bodyElement = document.querySelector("body").style;



function playMainAnimation() {

  console.log("playMainAnimation running");


  // since the sections are positioned absolute, we will need to set them in the correct place first
  gsap.set(sections, { xPercent: (i) => 100 * i });

  // create observer
  // since we want to move the sections up when we mouse-wheel-scroll down
  // but down when we touch- or pointer-drag down, we will need to 'invert' the logic for certain events
  // easiest by setting the wheelSpeed to -1 and inverting the direction argument for the change() function
  const intentObserver = Observer.create({
    target: window,
    type: "wheel,touch",
    wheelSpeed: -1,
    onUp: () => change(1),
    onDown: () => change(-1),
    onMove: () => console.log("onMove"),
    tolerance: 100,
  });

  function change(direction) {
    // check to only do things if we are not already animating
    if (!animating) {
      // check to only do things so we don't end up beyond the first or last section
      if (!(current === 0 && direction === -1) &&
        !(current === sections.length - 1 && direction === 1)) {
        console.log("start tweening");
        animating = true;
        nextIndex += direction;

        // set up the timeline to animate things
        const tl = gsap.timeline({
          // onComplete of the timeline update the current variable
          onComplete: function () {
            current += direction;
            animating = false;
            console.log("end tweening");

          },
          onStart: function () {
            console.log("start tweening");


          }
        });

        console.log("currentIndex: " + nextIndex);

        var forwards = "left";
        var backwards = "right";
        var bgColor = "#edefed";

        nextIndex === 3 ? bgColor = "#3b592a" : bgColor = "#edefed";

        direction === 1 ? forwards = "left" : forwards = "right";
        direction === 1 ? backwards = "right" : backwards = "left";

        if (nextIndex === 1 && direction === 1 || nextIndex === 0 && direction === -1) {
          console.log("second slide");


          tl.to(sections, { opacity: 0 })
            .to(sections, { delay: 0.1, xPercent: "-=" + direction * 100, }, "<+=0.4")
            .to(sections, { opacity: 1 })

        } else {
          gsap.set(wd, { background: bgColor })

          tl.to(wd, { scaleX: 1, transformOrigin: forwards, })
            .to(sections, { delay: 0.5, xPercent: "-=" + direction * 100, }, "<+=0.4")
            .to(wd, { scaleX: 0, duration: 0.5, TransformOrigin: backwards, })
        }



      } else if (direction === 1 && current === sections.length - 1) {
        console.log("last section");
        intentObserver.disable();
        $("body").css({
          overflow: "scroll",
          position: "static",
        })
      }
      else {
        console.log("nowhere to go");
      }
    }
  }
  var scrollTop = 0;
  $(document).scroll(function () {
    scrollTop = $(document).scrollTop();
    console.log(scrollTop);
    if (scrollTop <= 0) {
      $("body").css({
        overflow: "hidden",
        position: "fixed",
      })
      change(-1);
      intentObserver.enable();
    }
  })
  $("#goUpButton").click(function () {
    intentObserver.enable();
    $("body").css({
      overflow: "hidden",
      position: "fixed",
    })
    change(-1);
  });

  // Second slide Animations
  let secondSlideTimeLine = gsap.timeline({
    paused: true,
  });

  secondSlideTimeLine.from("#sec-02", {
    autoAlpha: 0,
    duration: 1.0,
  }).from(".boxContainer li", {
    y: "100%",
  }).to(".textContainer", {
    opacity: 1
  }).from(".boxContainer_image", {
    autoAlpha: 0,
    stagger: .2
  });


  // Observe the scroll position of the page
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        switch (entry.target.id) {
          case "sec-02":
            secondSlideTimeLine.progress() === 1 ? secondSlideTimeLine.restart() :
              secondSlideTimeLine.play();
            break;

          default:
            break;
        }
      }
    });
  }, { threshold: 1.0 });

  sections.forEach(section => {
    observer.observe(section);
  });


}
// Loading Screen

const overlay = $('#overlay');
const overlayGreen = $("#overlay_green");
const overlayGreenImg = $("#overlay_green img");
const overlayWhite = $("#overlay_white");

const slide1Title = $("#sec-01 h1");
let layerColorGrey = "#edefed";
let layerColorGreen = "#3b592a";


const tl = gsap.timeline({
  onComplete: () => {
    $(overlay).remove();
  }
});
tl.to(overlayGreen, {
  x: "0",
  delay: 0.8,
  duration: 0.5,
}).from(overlayGreenImg, {
  delay: 0.5,
  opacity: 0,
}).to(overlayWhite, { opacity: 0 })
  .to(overlayGreenImg, {
    opacity: 0,
  }, 3)
  .to(overlayGreen, {
    x: "100%",
    delay: 0.5,

  }, 3).from(slide1Title, {
    opacity: 0,
  }

  );




function checkViewportSize() {

  if (window.matchMedia("(min-width: 800px) and (min-height:1024px)").matches) {
    // Execute your jQuery function here
    console.log("iPad mini viewport detected");
    playMainAnimation();
  }
  else if (window.matchMedia("(min-width: 1000px) and (orientation:landscape)").matches) {
    console.log("iPad landscape viewport detected");
    playMainAnimation();
  }
  else {
    console.log("SMALL :iPad mini viewport not detected");


  }
}

// Run the checkViewportSize function on page load
window.onload = checkViewportSize;

// Run the checkViewportSize function on resize
window.addEventListener('resize', reloadPage);
// Run the checkViewportSize function on orientation change
window.addEventListener('orientationchange', reloadPage);

// reload page on resize and orientation change
function reloadPage() {
  if (window.matchMedia("(min-width: 1000px)").matches) {
    window.location.reload();
  }

}

