
// ************************************************************** //
// Hello!
// Running this sketch will post a visualization of your mouse
// movements every X minutes

// *********** Step 1 *********** //
// Install HTTP-Requests-for-Processing library

// *********** Step 2 *********** //
// Add your twitter name
// Works with any text without @ too!
String name = "@handle"; 

// *********** Step 3 *********** //
// Define minutes between posts!
int minutes = 10;

// *********** Step 3 *********** //

// ************************************************************** //

import java.awt.*;
import java.util.Date;
import http.requests.*;
import org.apache.commons.codec.binary.Base64;
import java.io.*;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;

PImage cursor;
PGraphics canvas;

Robot robot;
MousePoint mouse, pmouse;
long now = 0;
int waitTime = minutes * 60 * 1000;

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
  canvas = createGraphics(displayWidth, displayHeight);
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
  canvas.beginDraw();
  canvas.background(0);
  canvas.endDraw();
}

void draw() {
  canvas.beginDraw();
  //canvas.blendMode(ADD);
  if (mouse != null && pmouse != null && pmouse != mouse) {
    canvas.tint(255, 10);
    float scl = 0.1;
    canvas.image(cursor, mouse.x - 50 * scl, mouse.y - 40 * scl, 280 * scl, 400 * scl);
  }

  if (millis() - now > waitTime) {
    PImage snapshot = canvas.get();
    String base64 = toBase64(snapshot);
    PostRequest post = new PostRequest("https://mouse-bot-server.glitch.me/mouse/");
    post.addHeader("Content-Type", "application/json");
    post.addData("{\"minutes\":\""+minutes+"\",\"x\":\""+mouseX+"\",\"y\":\""+mouseY+"\",\"name\":\""+name+"\",\"base64\":\""+base64+"\"}");
    post.send();
    println("Reponse Content: " + post.getContent());
    println("Reponse Content-Length Header: " + post.getHeader("Content-Length"));
    tweet = false;
    canvas.background(0);
    now = millis();
  }
  canvas.endDraw();
  trackMouse();
  image(canvas, 0, 0, width, height);
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

public String toBase64(PImage img) {
  try {
    BufferedImage buffImage = (BufferedImage)img.getNative();
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    ImageIO.write(buffImage, "PNG", out);
    byte[] bytes = out.toByteArray();
    String base64 = Base64.encodeBase64URLSafeString(bytes);
    return base64;
  } 
  catch(Exception e) {
    return null;
  }
}
