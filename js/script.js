let ar = [];
let arORD = []


// initialization of the array we will sort
function main(){

    for(let i = 0; i < 800/5; i ++){
        ar.push(parseInt(Math.round(Math.random()*500)));
        arORD.push(ar[i]);
    }
}


// initialize the canvas and add some buttons
function canvas(){

    // remove display button
    var btn = document.getElementById("button");
    btn.parentElement.removeChild(btn);

    //create div for canvas
    var div = document.createElement("div")
    div.id = 'id1';


    var canv = document.createElement('canvas');
    canv.id = 'canv';
    canv.width = 800;
    canv.height = 600;

    var ctx = canv.getContext('2d');
    ctx.fillRect(0,0,800,600);
    ctx.clearRect(0, 0, canv.width, canv.height);

    var rstBTN = document.createElement("BUTTON");
    rstBTN.innerHTML = "RESET";
    rstBTN.addEventListener("click", resetArray);
    document.body.appendChild(rstBTN);

    document.body.appendChild(div); // adds the canvas to the body element
    div.appendChild(canv);

   
    drawLines(-1);    // draw columns the height values are in arORD[]
    addSortBTN();   // add the buttons that will sort the array

}

// draw a column for each Element in the array with proper height
function drawLines(pivot){
    var canv = document.getElementById('canv');

    var ctx = canv.getContext('2d');
    let x = 0;
    
    for(let i in ar){
        if(ar[i] == pivot)
            ctx.fillStyle = "red";
        else
            ctx.fillStyle='#000000';
        ctx.fillRect(x,canv.height,4,-arORD[i]);
        x+=5;
    }

    ctx.stroke();
}

// add a button that if pressed will start the quicksorting algorithm
function addSortBTN(){
    var div2 = document.createElement("div");
    div2.id = 'div2';


    var btnINS = document.createElement("BUTTON");
    btnINS.innerHTML = "Insertion sort";
    btnINS.addEventListener("click", Ins_Sorting)
    btnINS.style.backgroundColor = "green";


    var btnMERGE = document.createElement("button");
    btnMERGE.innerHTML = "Merge sort";
    btnMERGE.addEventListener("click", Merge_Sorting_start);
    btnMERGE.style.backgroundColor = "crimson";

    var btnQUICK = document.createElement("button");
    btnQUICK.innerHTML = "Quick sort";
    btnQUICK.addEventListener("click", Quick_sort_start);
    btnQUICK.style.backgroundColor = "aqua";

    document.body.appendChild(div2);
    div2.appendChild(btnINS);
    div2.appendChild(btnMERGE);
    div2.appendChild(btnQUICK);
}

// apply the sorting algorithm to the array
async function Ins_Sorting(){

    for(let j = 1; j < arORD.length; j++){
        let key = arORD[j];
        let i = j - 1;

        while(i >= 0 && arORD[i] > key){
            arORD[i+1] = arORD[i];
            i--;
        }
        arORD[i+1] = key;

        updateCanvas();
        await sleep(50);
    }

    
}

// function that start the merge sort, needed to call another function because i have to pass
// the arguments
async function Merge_Sorting_start(){

    await Merge_Sorting(0, arORD.length);
    await sleep(10);
    updateCanvas(-1);
}

// call recursively to sort every substring each time the lenght is halfed
async function Merge_Sorting(first, last){
    let half = 0;
    if(first >= last)
        return;
    
    half = first + parseInt((last-first)/2);
    
    await Merge_Sorting(first, half);
    await Merge_Sorting( half+1, last);

    updateCanvas(-1);
    await sleep(20);
    
    await Merge(first, half, last);
}


// reorder each substring
async function Merge(first, half, last){

    // dimension of the two ausiliary string
    let dim1 = half - first + 1;    
    let dim2 = last - half;

    // use 2 different string to store temp values that need to be ordered
    let L1 = [];
    let L2 = [];

    for(let i = 0; i < dim1; i++){
        L1.push(arORD[first+i]);
    }
    for(let i = 0; i < dim2; i++){
        L2.push(arORD[half+i+1]);
    }


    // start point of each string
    let tmp1 = 0;
    let tmp2 = 0;
    let k = first;

    // here we order the string parsing each the two substring
    // that are already ordered before
    while(tmp1 < dim1 && tmp2 < dim2){

        if(L1[tmp1] <= L2[tmp2]){
            arORD[k] = L1[tmp1];
            tmp1++;
        }
        else{
            arORD[k] = L2[tmp2];
            tmp2++;
        }

        k++;
       
    }

    while(tmp1 < dim1){
        arORD[k] = L1[tmp1];
        tmp1++;
        k++
    }

    while(tmp2 < dim2){
        arORD[k] = L2[tmp2];
        tmp2++;
        k++;
    }

    

}


async function Quick_sort_start(){

    await Quick_sort(0, arORD.length)

    await sleep(10);
    updateCanvas(-1);

}

async function Quick_sort(first, last){
    if(first >= last) return;

    let subset = await quick_sort_partition(first, last)
    
    await Quick_sort(first, subset - 1);
    await Quick_sort(subset + 1, last);
}

async function quick_sort_partition(first, last){
    let pivot = arORD[last]
    let i = first - 1;
    for(let j = first; j < last; j++){
        
        if(arORD[j] <= pivot){
            i++;
            let tmp = arORD[j];
            arORD[j] = arORD[i];
            arORD[i] = tmp;
        }
        
    }
    
    await sleep(100);
    updateCanvas(pivot);

    let tmp = arORD[last];
    arORD[last] = arORD[i+1];
    arORD[i+1] = tmp;

    return i+1;
}
// redraw the canvas with the columns in the array
function updateCanvas(pivot){
    var canv = document.getElementById('canv');
    var ctx = canv.getContext('2d');

    ctx.clearRect(0, 0, canv.width, canv.height);

    drawLines(pivot);


}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}

// reset the array to it's initial valuse
function resetArray(){
    for(let i in ar){
        arORD[i] = ar[i];
        updateCanvas(-1);
    }
}