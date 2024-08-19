import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

export const Reviews = () => {
    const [reviews, setReviews] = useState([
        {
            stars: '⭐⭐⭐⭐⭐',
            title: 'Game-Changer for My Fitness Journey!',
            content: 'FitTrack Pro has completely transformed how I approach fitness. The personalized workout plans are spot-on, and the progress tracking keeps me motivated every day. I love how the app adapts as I improve, ensuring that I’m always challenged. The community challenges are a fun bonus that keeps me engaged. Highly recommend!',
            // image: 'path_to_image1.jpg', // Add the actual image path here
            name: 'Sophia R.',
            designation: '',
        },
        {
            stars: '⭐⭐⭐⭐⭐',
            title: 'All-In-One Fitness Solution!',
            content: 'This app has everything I need to stay on top of my fitness goals. From tracking my meals to suggesting new exercises, FitTrack Pro covers it all. The AI-powered recommendations are super helpful, especially when I want to mix things up in my routine. It’s like having a personal trainer and nutritionist in my pocket!',
            // image: 'path_to_image2.jpg', // Add the actual image path here
            name: 'James T.',
            designation: '',
        },
        {
            stars: '⭐⭐⭐⭐',
            title: 'Keeps Me Accountable!',
            content: 'I’ve tried several fitness apps, but FitTrack Pro is by far the most comprehensive. The progress monitoring features are fantastic, and I can really see how far I’ve come. The only reason I’m giving it 4 stars is that I’d love to see more variety in the premium workouts, but overall, it’s an amazing app!',
            // image: 'path_to_image3.jpg', // Add the actual image path here
            name: 'Emily L.',
            designation: '',
        },
        {
            stars: '⭐⭐⭐⭐⭐',
            title: 'Perfect for Busy Lifestyles!',
            content: 'As someone with a hectic schedule, FitTrack Pro is a lifesaver. The quick and effective workouts fit perfectly into my day, and the app’s ability to track everything—from my diet to my exercise—helps me stay on top of my health. The user interface is intuitive, and I love how seamless the experience is!',
            // image: 'path_to_image4.jpg', // Add the actual image path here
            name: 'David M.',
            designation: '',
        },
        {
            stars: '⭐⭐⭐⭐⭐',
            title: 'Motivation on Another Level!',
            content: 'What I love most about FitTrack Pro is the community aspect. The challenges and social features keep me motivated and connected with others who share similar goals. Plus, the real-time tracking is incredibly satisfying. Seeing my progress in charts and graphs really pushes me to keep going.',
            // image: 'path_to_image5.jpg', // Add the actual image path here
            name: 'Aisha K.',
            designation: '',
        },
        {
            stars: '⭐⭐⭐⭐',
            title: 'A Comprehensive Fitness Tool',
            content: 'FitTrack Pro offers a lot of great features that make fitness tracking easy and enjoyable. The personalized plans are a great touch, and the app’s design is sleek and user-friendly. I only wish the nutrition tracking had a wider food database, but it’s still a fantastic app for anyone serious about fitness!',
            // image: 'path_to_image6.jpg', // Add the actual image path here
            name: 'Chris P.',
            designation: '',
        },
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    return (
        <div className='project-bg flex flex-col justify-center items-center mb-4'>
            <div className='text-center flex flex-col justify-center items-center mb-6'>
                <h2 className='text-4xl md:text-5xl xl:text-6xl font-semibold mb-2'>Reviews</h2>
                <p className=' text-black font-medium'>
                    What people have to say about us
                </p>
            </div>
            <div className='w-[85%] flex mb-4'>
                <Swiper
                    spaceBetween={10}
                    slidesPerView={3}
                    centeredSlides={true}
                    pagination={{
                        dynamicBullets: true,
                        clickable: true
                    }}
                    loop={false}
                    breakpoints={{
                        640: {
                            slidesPerView: 1,
                        },
                        768: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        },
                        1280: {
                            slidesPerView: 3,
                        },
                    }}
                    modules={[Pagination]}
                    className='w-full flex'
                >
                    {reviews.map((review, index) => (
                        <SwiperSlide key={index}>
                            <div className='review-item text-left p-6 bg-white shadow-xl flex flex-col justify-start gap-2 h-[350px]'>

                                <div className='review-stars mb-2'>{review.stars}</div>
                                <h3 className='text-xl font-semibold mb-2'>{review.title}</h3>
                                <p className='text-gray-600 mb-4'>{review.content}</p>
                                <div className='flex items-center gap-4'>
                                    {/* <img src={review.image} alt={review.name} className='review-image w-16 h-16 rounded-full ' /> */}
                                    <div>
                                        <strong>{review.name}</strong>
                                        <p> {review.designation}</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default Reviews;
