import React from 'react'
import styles from './Features.module.css'
const Features = () => {
  return (
    <div>
      <section className="min-h-screen bgg text-center py-20 px-8 xl:px-0 flex flex-col justify-center">
      <span className="text-black text-lg max-w-lg mx-auto mb-2 capitalize flex items-center">
        what we're offering
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="ml-3 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
          />
        </svg>
      </span>
      <h1 className="text-black text-4xl md:text-5xl xl:text-6xl font-semibold max-w-3xl mx-auto mb-16 leading-snug">
        Services Built Specifically for your Goals
      </h1>
      <div className="grid-offer text-left grid sm:grid-cols-2 md:grid-cols-2 gap-5 max-w-5xl mx-auto border-2">
        <div className={`${styles.card} bg-white p-10 relative`}>
          <div className={`${styles.circle} ${styles.circle1}`}></div>
          <div className="relative lg:pr-52">
            <h2 className={`${styles.h2} capitalize text-black mb-4 text-2xl xl:text-3xl font-semibold`}>
            Nutrition Tracking
            </h2>
            <p className="text-black">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames.
            </p>
          </div>
        </div>
        <div className={`${styles.card} bg-white p-10 relative`}>
          <div className={`${styles.circle} ${styles.circle2}`}></div>
          <div className="relative lg:pl-48">
            <h2 className={`${styles.h2} capitalize text-black mb-4 text-2xl xl:text-3xl font-semibold`}>
            Personalised <br /> diet plans
            </h2>
            <p className="text-black">
              Get dietary plans made just for you which meets your specifications
            </p>
          </div>
        </div>
        <div className={`${styles.card} bg-white p-10 relative`}>
          <div className={`${styles.circle} ${styles.circle3}`}></div>
          <div className="relative lg:pr-44">
            <h2 className={`${styles.h2} capitalize text-black mb-4 text-2xl xl:text-3xl font-semibold`}>
              Calorie <br />Management
            </h2>
            <p className="text-black">
              Track your calorie intake with comaprision of calorie burnt fast tracking your progress
            </p>
          </div>
        </div>
        <div className={`${styles.card} bg-white p-10 relative`}>
          <div className={`${styles.circle} ${styles.circle4}`}></div>
          <div className="relative lg:pl-48">
            <h2 className={`${styles.h2} capitalize text-black mb-4 text-2xl xl:text-3xl font-semibold`}>
              Security
            </h2>
            <p className="text-black">
              Secure and safe,your data is always your data and will never be compromised
            </p>
          </div>
        </div>
      </div>
    </section>
    </div>
  )
}

export default Features
