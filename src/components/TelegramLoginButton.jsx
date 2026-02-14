import { useEffect, useRef } from 'react';

export default function TelegramLoginButton({ botName, onAuth, className }) {
    const buttonRef = useRef(null);

    useEffect(() => {
        // Prevent duplicate script injection
        if (buttonRef.current && buttonRef.current.innerHTML !== '') return;

        const script = document.createElement('script');
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.setAttribute('data-telegram-login', botName);
        script.setAttribute('data-size', 'large'); // or medium, small
        script.setAttribute('data-radius', '12');
        script.setAttribute('data-request-access', 'write');
        script.setAttribute('data-userpic', 'false'); // We show avatar ourselves
        script.async = true;

        // Define the global callback function that Telegram will call
        window.onTelegramAuth = (user) => {
            onAuth(user);
        };
        script.setAttribute('data-onauth', 'onTelegramAuth(user)');

        if (buttonRef.current) {
            buttonRef.current.appendChild(script);
        }

        return () => {
            // Cleanup global function on unmount
            // delete window.onTelegramAuth; // strict mode might cause issues if we delete
        };
    }, [botName, onAuth]);

    return <div ref={buttonRef} className={className} />;
}
