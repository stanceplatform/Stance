import React from 'react'
import Header from './components/Header'
import Logo from './components/Logo'
import Footer from './components/Footer'
import GoogleSignIn from './components/provider/GoogleSignIn'

const Landing = () => {
    return (
        <main className="flex flex-col mx-auto w-full bg-purple-900 max-w-[480px] h-screen">
            <section
                className="flex relative flex-col items-center w-full h-screen bg-cover bg-center"
                style={{
                    backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets/TEMP/977014e26f9df71355ad12e5ce2a5a8568fe42a193f8ee2cde09a383dbc74ffc?placeholderIfAbsent=true&apiKey=9667f82c7e1b4746ad9299d82be6adf4')`
                }}
            >
                <Header />
                <Logo />
                <GoogleSignIn />
                <Footer />
            </section>
        </main>
    )
}

export default Landing