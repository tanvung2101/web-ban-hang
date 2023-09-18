import React from 'react'
import loading from './../public/Ellipsis-1s-200px.gif'
import Image from 'next/image'

const Loading = () => {
    return (
        <div className='w-full h-screen flex items-start justify-center'>
            <Image src={loading.src} alt='' width={100} height={100} />
        </div>
    )
}

export default Loading