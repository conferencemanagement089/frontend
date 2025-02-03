import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const Home = () => {
    const navigate = useNavigate();  // Initialize navigate function

    // Function to handle navigation to the RegisterPage
    const goToRegisterPage = () => {
        navigate('/register');  // Navigate to the register page
    };

    return (
        <div className="home-container">
            <h1>National Water and Energy Center</h1>
            
            <div className="conference-gallery">
                <div className="conference-card">
                    <img src="https://pbs.twimg.com/media/GbjLDSfXMAA4Vsz?format=jpg&name=large" alt="Conference 1" />
                    <h3>Eighth International Symposium on Flash Floods in Wadi Systems (ISFF8)</h3>
                    <p>Climate change has caused more frequent, severe heavy rainfall events, causing human and economic damage. Large-scale urbanization, population increase in flood-prone areas, deforestation, climate change, and increasing sea levels will leave more people exposed to hazardous floods. Extreme weather and climate can devastate societies and the environment. A third of the planet’s landmass is arid or semi-arid. These regions are prone to flash floods due to localized convective rainfall and poor soil development.</p>
                </div>
                
                <div className="conference-card">
                    <img src="https://www.uaeu.ac.ae/ar/news/2024/february/images/27feb-big.jpg" alt="Conference 2" />
                    <h3>2nd International Conference Water Resources Management & Sustainability: Solutions for Arid Regions</h3>
                    <p>Water is vital for all types of life. Without water, life cannot be sustained. The lack of freshwater resources in arid and semi-arid regions constitutes the major deterrent to sustainable development. The rapid population growth, rising standards of living and per capita water consumption, expansion in urbanization, industrial and agricultural activities, and climate change pose considerable challenges on the use and management of water resources..</p>
                </div>

                <div className="conference-card">
                    <img src="https://stepconsulting.de/src/images/publications/105098540866792_32f297702be03e12e5db3dafa7b57f0f.webp" alt="Conference 3" />
                    <h3>International Conference Water Resources Management & Sustainability: Solutions for Arid Regions</h3>
                    <p>Without water, life cannot be sustained, and factors such as population growth, increased urbanization, and climate change all contribute to a lack of freshwater resources. A particularly acute challenge for arid and semi-arid regions, water scarcity can impact all aspects of sustainable development.</p>
                </div>
            </div>

            <div className="cta-section">
                <p>Ready to attend a conference? <strong>Join us today!</strong></p>
                <button onClick={goToRegisterPage}>Register</button> {/* On click, navigate to register page */}
            </div>

            <div className="additional-description">
                <h2>About</h2>
                <p>
                The national prosperity and economic vitality and growth depend upon the availability of adequate future supplies of water and energy. Therefore, the UAE Government’s vision for a sustainable future includes the two most critical resources, water and energy as two of its primary pillars. Following the national interest, the United Arab Emirates University (UAEU) initiatives in research and innovation give high priority to the conservation and sustainability of water resources and energy.
                </p>
                <h3>Vision, Mission & Objectives:</h3>
                <ul>
                    <li><strong>Vision:</strong> To achieve leadership and innovation in research and community services in water resources and energy harvesting, storage, and efficiency.</li>
                    <li><strong>Mission:</strong> To address water resources, energy, and environmental challenges in arid and semi-arid regions through innovative, integrated, interdisciplinary approaches while working closely with stakeholders. In addition, to implementing scientific and applied research and to operate in collaboration with concerned national, regional, and international authorities and agencies to ensure the sustainability of water resources, energy, and environmental systems. Moreover, endeavor to improve the quality of life while preserving the natural resources and support the UAEU’s visibility and reputation.</li>
                    <li><strong>Objectives:</strong> The main objective of the NWEC is to provide a robust and interdisciplinary framework that can identify suitable future development scenarios, selection criteria and intervention options resulting in more reliable, resilient, and sustainable water resources and energy uses. The NWEC aims to pursue a holistic and innovative approach for research, development, as well as the deployment of key technologies to generate solutions that contribute to all water-energy related development goals.</li>
                </ul>
            </div>
        </div>
    );
};

export default Home;
