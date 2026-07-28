// app.js

const skuData = {

    "100062": {

        files:[

            {
                name:"100062.zip",
                type:"zip",
                url:"sku/100062/100062.zip"
            },

            {
                name:"说明书.pdf",
                type:"pdf",
                url:"sku/100062/说明书.pdf"
            },

            {
                name:"产品图1.jpg",
                type:"image",
                url:"sku/100062/产品图1.jpg"
            },

            {
                name:"演示视频.mp4",
                type:"video",
                url:"sku/100062/演示视频.mp4"
            }

        ]

    }

};



// 搜索SKU

function searchSKU(){


    let sku = document
        .getElementById("search")
        .value;



    if(skuData[sku]){

        showFiles(sku);

    }else{

        alert("没有找到SKU");

    }

}




// 显示文件

function showFiles(sku){


    let box=document.getElementById("result");


    box.innerHTML="";


    skuData[sku].files.forEach(file=>{


        let item=document.createElement("div");


        item.innerHTML=`

        <h3>${file.name}</h3>

        <button onclick="
        openFile('${file.type}','${file.url}')
        ">
        打开
        </button>

        `;


        box.appendChild(item);


    });


}



// 根据类型打开

function openFile(type,url){



    if(type==="video"){


        document.getElementById("player").src=url;


        document.getElementById("player").play();


    }



    else if(type==="image"){


        window.open(url);


    }



    else if(type==="pdf"){


        window.open(url);


    }



    else if(type==="zip"){


        window.open(url);


    }



}
