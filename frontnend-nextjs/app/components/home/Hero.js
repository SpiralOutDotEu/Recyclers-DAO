import React from 'react';
import Image from 'next/image'

const Hero = () => {
    return (
        <section className="bg-white text-black py-16">
            <div className="container mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Revolutionizing Image Data for a Cleaner Future
                </h1>
                <p className="text-lg md:text-xl mb-8">
                    Welcome to <span className="font-bold">Recyclers DAO</span>, where we are changing the game in image collection and waste detection.
                    We&apos;re on a mission to create the world&apos;s largest image database, powering image recognition and waste detection technologies to protect our environment.
                </p>
                <p className="text-lg md:text-xl mb-8">
                    With our innovative DAO, contributing to the world&apos;s largest image database has never been easier. Simply take a photo of a product or waste using your smartphone, and you&apos;ll automatically earn tokens for your valuable contribution. Our decentralized platform empowers individuals to actively participate in building a comprehensive repository of images used for image identification and waste detection. By harnessing the collective efforts of our community, we&apos;re rewarding users for their environmental stewardship while simultaneously advancing cutting-edge technology for a cleaner and more sustainable future
                </p>
                <div className="flex justify-center">
                    <Image
                        src="/undraw_among_nature_p1xb.png" // Replace with your image path
                        alt="Among Nature "
                        width={500}
                        height={500}
                        className="max-w-full h-auto"
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;