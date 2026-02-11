import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

export default function ApplicationLogo({ className }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* The Rocket Icon in Pink */}
            <RocketLaunchIcon sx={{ fontSize: 32, color: '#be185d' }} />
            
            {/* Your Brand Name */}
            <span style={{ 
                fontWeight: 900, 
                fontSize: '1.5rem', 
                color: '#1e293b',
                letterSpacing: '-0.05em' 
            }}>
                MANAGER<span style={{ color: '#be185d' }}>.</span>
            </span>
        </div>
    );
}