import java.awt.*;
import java.util.Date;

import http.requests.*;
PImage cursor;
PGraphics canvas;

Robot robot;
MousePoint mouse, pmouse;

long now = 0;

int waitTime = 15 * 60 * 1000;

boolean tweet = false;

class MousePoint {

  int x;
  int y;
  long time;

  MousePoint(int x, int y, long time) {
    this.x = x;
    this.y = y;
    this.time = time;
  }
}


float scaleDown = 0.25;

void settings() {
  size(int(displayWidth * scaleDown), int(displayHeight * scaleDown));
}

void setup() {
  cursor = loadImage("cursor.png");
  try { 
    robot = new Robot();
  } 
  catch(Exception e) {
    println(e);
  }
  int buttons = MouseInfo.getNumberOfButtons();
  if (buttons < 0) {
    println("no mouse");
    exit();
  }
  background(0);
}

void draw() {
  scale(scaleDown);
  if (mouse != null && pmouse != null && pmouse != mouse) {
    stroke(255, 100);
    strokeWeight(4);
    line(mouse.x, mouse.y, pmouse.x, pmouse.y);
  }

  if (millis() - now > waitTime) {
    imageMode(CORNER);
    float scl = 0.25;
    image(cursor, mouse.x - 50 * scl, mouse.y - 40 * scl, 280 * scl, 400 * scl);
    save("cursor.png");
    GetRequest get = new GetRequest("http://localhost:3000/mouse/" + mouseX + "/" + mouseY); 
    get.send();
    println("Reponse Content: " + get.getContent());
    println("Reponse Content-Length Header: " + get.getHeader("Content-Length"));
    tweet = false;
    background(0);
    now = millis();
  }
  trackMouse();
}

boolean same(MousePoint m1, MousePoint m2) {
  return (m1.x == m2.x && m1.y == m2.y);
}

void trackMouse() {
  try {
    PointerInfo pInfo = MouseInfo.getPointerInfo();
    Point point = pInfo.getLocation();
    int x = (int) point.getX();
    int y = (int) point.getY();
    pmouse = mouse;
    mouse = new MousePoint(x, y, new Date().getTime());
    // int wait = 33;//robot.getAutoDelay();
    // robot.delay(wait);
    // delay(wait);
  } 
  catch(Exception e) {
    println(e);
  }
}
