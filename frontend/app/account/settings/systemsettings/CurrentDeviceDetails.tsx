'use client';
import React, { useState, useEffect } from 'react';
import {
  FaDesktop,
  FaMobileAlt,
  FaClock,
  FaGlobe,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import {
  SiBrave,
  SiFirefox,
  SiGooglechrome,
  SiMicrosoftedge,
  SiOpera,
  SiSafari,
} from 'react-icons/si';

const CurrentDeviceDetailsSection = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [deviceType, setDeviceType] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [browser, setBrowser] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    // Detect device type
    const userAgent = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
      setDeviceType('tablet');
    } else if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        userAgent,
      )
    ) {
      setDeviceType('mobile');
    } else {
      setDeviceType('desktop');
    }

    // Fetch IP address
    fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((data) => setIpAddress(data.ip));

    // Detect browser
    const browserName = (function () {
      const userAgent = navigator.userAgent;
      let browserName;

      if (userAgent.match(/chrome|chromium|crios/i)) {
        browserName = 'Chrome';
      } else if (userAgent.match(/firefox|fxios/i)) {
        browserName = 'Firefox';
      } else if (userAgent.match(/safari/i)) {
        browserName = 'Safari';
      } else if (userAgent.match(/opr\//i)) {
        browserName = 'Opera';
      } else if (userAgent.match(/edg/i)) {
        browserName = 'Edge';
      } else if (userAgent.match(/brave/i)) {
        browserName = 'Brave';
      } else {
        browserName = 'Unknown';
      }

      return browserName;
    })();
    setBrowser(browserName);

    // Fetch location
    fetch('https://ipapi.co/json/')
      .then((response) => response.json())
      .then((data) => setLocation(`${data.city}, ${data.country_name}`));

    return () => clearInterval(timer);
  }, []);

  const getBrowserIcon = (browserName: string) => {
    switch (browserName) {
      case 'Chrome':
        return <SiGooglechrome className="text-2xl" />;
      case 'Firefox':
        return <SiFirefox className="text-2xl" />;
      case 'Safari':
        return <SiSafari className="text-2xl" />;
      case 'Opera':
        return <SiOpera className="text-2xl" />;
      case 'Edge':
        return <SiMicrosoftedge className="text-2xl" />;
      case 'Brave':
        return <SiBrave className="text-2xl" />;
      default:
        return <FaGlobe className="text-2xl" />;
    }
  };

  return (
    <div className="bg-white h-full" aria-label="Settings Section">
      <div className=" mx-auto overflow-hidden">
        <div className="p-2">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Current Active Device
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div
                className="flex items-center space-x-4"
                aria-label="Active Device Details"
              >
                {deviceType === 'desktop' ? (
                  <FaDesktop className="text-4xl text-blue-500" />
                ) : (
                  <FaMobileAlt className="text-4xl text-green-500" />
                )}
                <div>
                  <h2 className="text-xl font-semibold text-gray-700">
                    Active Device
                  </h2>
                  <p className="text-gray-600">
                    {deviceType.charAt(0).toUpperCase() + deviceType.slice(1)}
                  </p>
                </div>
              </div>
              <div aria-label="IP Address">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  IP Address
                </h2>
                <p className="text-gray-600">{ipAddress || 'Loading...'}</p>
              </div>
              <div aria-label="Current Time">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Current Time
                </h2>
                <div className="flex items-center space-x-2">
                  <FaClock className="text-2xl text-yellow-500" />
                  <p className="text-gray-600">
                    {currentTime.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div aria-label="Browser Details">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Browser
                </h2>
                <div className="flex items-center space-x-2">
                  {getBrowserIcon(browser)}
                  <p className="text-gray-600">{browser}</p>
                </div>
              </div>
              <div aria-label="Current Location">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Location
                </h2>
                <div className="flex items-center space-x-2">
                  <FaMapMarkerAlt className="text-2xl text-red-500" />
                  <p className="text-gray-600">{location || 'Loading...'}</p>
                </div>
              </div>
              <div aria-label="Additional Details">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Additional Details
                </h2>
                <p className="text-gray-600">
                  Screen Resolution: {window.screen.width}x
                  {window.screen.height}
                </p>
                <p className="text-gray-600">
                  Color Depth: {window.screen.colorDepth}-bit
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentDeviceDetailsSection;
