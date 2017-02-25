function  printStuff(myName) {
  this.name = myName;
};

printStuff.prototype.print = function() {
  console.log("This is my name:", this.name);
};

var newObj = new printStuff("Sharat Masetty");

newObj.print();
for (var propName in newObj)
{
  console.log(newObj[propName]);
};
console.log(newObj.prototype);
console.log(printStuff.prototype);

var obj = new Object();

console.log(obj.constructor);

function Plant(){
  this.country = 'Mexico';
  this.isOrganic = 'true';
};

Plant.prototype.showNameandColor = function() {
  console.log("I am a " + this.name + " and my color is " + this.color + ".");
};

Plant.prototype.amIOrganic = function() {
  if(this.isOrganic) {
    console.log("I am an organic fruit");
  }
};

function fruit(fruitName, fruitColor) {
  this.name = fruitName;
  this.color = fruitColor;
};

fruit.prototype = new Plant();

var banana= new fruit("Banana", "Yellow");
banana.showNameandColor();
banana.amIOrganic();



