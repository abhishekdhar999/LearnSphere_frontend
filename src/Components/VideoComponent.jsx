import React from 'react'

export default function VideoComponent({video}) {
  
  return (
    <>
     <div class="flex justify-center my-12">
    <div class="rounded-lg shadow-lg bg-white max-w-lg mx-4">
        <a href="#!">
            <video width="320" height="240" controls class="w-full rounded-t-lg">
                <source src={video.videoFile} type="video/mp4"/>
                <source src="movie.ogg" type="video/ogg"/>
                Your browser does not support the video tag.
            </video>
        </a>
        <div class="p-6">
            <h5 class="text-gray-900 text-xl font-medium mb-2">{video.title}</h5>
            <p class="text-gray-700 text-base mb-4">
                {video.description}
            </p>
            <p className='flex'>
              {/* Teacher : {video.owner.name} */}
               {/* {owner} */}
            </p>
            <p className='flex'>
              {/* views :  */}
              {/* {views} */}
            </p>
            {/* <button type="button" class=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Button</button> */}
        </div>
    </div>
</div>
    </>
  )
}
