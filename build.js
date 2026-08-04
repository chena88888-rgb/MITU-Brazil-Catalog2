// build.js
//
// 自动扫描SKU文件夹
// 自动生成 catalog.json
//


const fs = require("fs");

const path = require("path");

const PRODUCTS = require("./products.json");



// 当前仓库目录

const ROOT = __dirname;



// 输出文件

const OUTPUT = "catalog.json";

function formatTime(time){

    const date = new Date(time);


    return date.toLocaleString(
        "zh-CN",
        {
            year:"numeric",
            month:"2-digit",
            day:"2-digit",
            hour:"2-digit",
            minute:"2-digit"
        }
    );

}

function getUpdateTime(filePath){

    const stat = fs.statSync(filePath);

    return formatTime(stat.mtime);

}





/*
===============================
判断文件类型
===============================
*/


function getType(file){


    const ext =

    path.extname(file)

    .toLowerCase();



    // 图片

    if(

        [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
            ".gif"
        ]

        .includes(ext)

    ){

        return "image";

    }





    // 产品参数HTML

    if(

        ext === ".html"

        &&

        file.toLowerCase()
        ===
        "product-spec.html"

    ){

        return "spec";

    }





    // PDF备用

    if(

        ext === ".pdf"

    ){

        return "pdf";

    }





    // 视频

    if(

        [
            ".mp4",
            ".mov",
            ".webm",
            ".avi"
        ]

        .includes(ext)

    ){

        return "video";

    }







    // 压缩包

    if(

        [
            ".zip",
            ".rar",
            ".7z"
        ]

        .includes(ext)

    ){

        return "archive";

    }





    return "file";


}







/*
===============================
生成catalog
===============================
*/


function buildCatalog(){



    const catalog = {};



    const folders =

    fs.readdirSync(ROOT);






    folders.forEach(folder=>{





        const folderPath =

        path.join(ROOT,folder);






        /*
        只处理数字SKU文件夹

        例如：

        100056
        100057

        */

        if(

            fs.statSync(folderPath)
            .isDirectory()

            &&

            /^\d+$/.test(folder)

        ){


        console.log("发现SKU:", folder);




            const files =

            fs.readdirSync(folderPath);







           catalog[folder]={
catalog[folder]={


    sku:folder,


    name:
    PRODUCTS[folder]?.name || "",


    category:
    PRODUCTS[folder]?.category || "",


    keywords:
    PRODUCTS[folder]?.keywords || [],


    updatedAt:
    getUpdateTime(folderPath),


    files:[]

};








            files.forEach(file=>{





               catalog[folder]
.files
.push({

    name:file,


    type:getType(file),


    url:

    `${folder}/${file}`,


    updatedAt:

    getUpdateTime(
        path.join(folderPath,file)
    )


});





            });






        }






    });








    fs.writeFileSync(


        OUTPUT,


        JSON.stringify(

            catalog,

            null,

            2

        ),


        "utf-8"


    );





    console.log(

        "catalog.json生成完成"

    );





}






buildCatalog();