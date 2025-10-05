import { Colors } from '@/constants/theme';
import React, { useState } from 'react';

type CommuteType = '' | 'bus' | 'tram' | 'train';

interface TransportOption {
  type: CommuteType;
  icon: string;
  label: string;
  color: string;
}

const TRANSPORT_OPTIONS: TransportOption[] = [
  { type: 'bus', icon: '🚌', label: 'Bus', color: '#486db1' },
  { type: 'tram', icon: '🚊', label: 'Tram', color: '#98c254' },
  { type: 'train', icon: '🚆', label: 'Train', color: '#d83189' },
];

const TransportSelector: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [selectedType, setSelectedType] = useState<CommuteType | null>(null);

  const handleMainButtonPress = (): void => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 200);
    
    if (isExpanded) {
      setIsClosing(true);
      setTimeout(() => {
        setIsExpanded(false);
        setIsClosing(false);
      }, 600); // Match animation duration
    } else {
      setIsExpanded(true);
    }
  };

  const handleTransportSelect = (type: CommuteType): void => {
    setSelectedType(type);
    setIsClosing(true);
    setTimeout(() => {
      setIsExpanded(false);
      setIsClosing(false);
    }, 600);
    console.log('Selected transport type:', type);
  };


  return (
    <>
      <style>
        {`
          @keyframes bubbleFlowOut {
            0% {
              transform: scale(0) translate(0, 0) rotate(0deg);
              top: 0px;
              left: 0px;
              opacity: 0;
            }
            15% {
              transform: scale(0.2) translate(0, 0) rotate(0deg);
              top: 0px;
              left: 0px;
              opacity: 0.4;
            }
            30% {
              transform: scale(0.6) translate(0, 0) rotate(0deg);
              top: calc(var(--target-top) * 0.3);
              left: calc(var(--target-left) * 0.3);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.1) translate(0, 0) rotate(0deg);
              top: calc(var(--target-top) * 0.7);
              left: calc(var(--target-left) * 0.7);
              opacity: 0.9;
            }
            70% {
              transform: scale(0.95) translate(0, 0) rotate(0deg);
              top: calc(var(--target-top) * 1.05);
              left: calc(var(--target-left) * 1.05);
              opacity: 1;
            }
            100% {
              transform: scale(1) translate(0, 0) rotate(0deg);
              top: var(--target-top);
              left: var(--target-left);
              opacity: 1;
            }
          }
          
          @keyframes bubbleFlowIn {
            0% {
              transform: scale(1) translate(0, 0) rotate(0deg);
              top: var(--target-top);
              left: var(--target-left);
              opacity: 1;
            }
            30% {
              transform: scale(0.8) translate(0, 0) rotate(0deg);
              top: calc(var(--target-top) * 0.5);
              left: calc(var(--target-left) * 0.5);
              opacity: 0.8;
            }
            70% {
              transform: scale(0.3) translate(0, 0) rotate(0deg);
              top: calc(var(--target-top) * 0.1);
              left: calc(var(--target-left) * 0.1);
              opacity: 0.4;
            }
            100% {
              transform: scale(0) translate(0, 0) rotate(0deg);
              top: 0px;
              left: 0px;
              opacity: 0;
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-3px);
            }
          }
          
          @keyframes bounce {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(0.9);
            }
            100% {
              transform: scale(1);
            }
          }
        `}
      </style>
      <div style={styles.container}>
        {/* Transport option bubbles */}
        {(isExpanded || isClosing) && TRANSPORT_OPTIONS.map((option, index) => {
        const positions = [
          { top: '-80px', left: '0px' }, // top
          { top: '-50px', left: '-50px' }, // left-top
          { top: '0px', left: '-80px' }, // left
        ];
        
        const animationDelay = index * 0.1; // Stagger the animations
        
        return (
          <div
            key={option.type}
            style={{
              ...styles.transportBubble,
              backgroundColor: option.color,
              top: isClosing ? positions[index].top : '0px',
              left: isClosing ? positions[index].left : '0px',
              transform: isClosing ? 'scale(1) translate(0, 0)' : 'scale(0) translate(0, 0)',
              animation: isClosing 
                ? `bubbleFlowIn 0.6s ease-in ${animationDelay}s forwards`
                : `bubbleFlowOut 0.8s ease-out ${animationDelay}s forwards`,
              '--target-top': positions[index].top,
              '--target-left': positions[index].left,
            } as React.CSSProperties}
          >
            <button
              style={styles.transportButton}
              onClick={() => handleTransportSelect(option.type)}
            >
              <span style={{ fontSize: '24px' }}>{option.icon}</span>
            </button>
          </div>
        );
      })}

      {/* Main circle button */}
      <div style={styles.mainButton}>
        <button
          style={{
            ...styles.mainButtonTouchable,
            backgroundColor: selectedType ? '#486db1' : '#687076',
            transform: isExpanded ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'all 0.3s ease',
          }}
          onClick={handleMainButtonPress}
        >
          {selectedType ? (
            <span style={{ fontSize: '24px', color: '#fff' }}>
              {TRANSPORT_OPTIONS.find(option => option.type === selectedType)?.icon}
            </span>
          ) : (
            <span style={{ fontSize: '24px', color: '#fff' }}>+</span>
          )}
        </button>
      </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    position: 'absolute' as const,
    bottom: '100px',
    right: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  mainButton: {
    width: '60px',
    height: '60px',
    borderRadius: '30px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  mainButtonTouchable: {
    width: '60px',
    height: '60px',
    borderRadius: '30px',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
  },
  transportBubble: {
    position: 'absolute' as const,
    width: '50px',
    height: '50px',
    borderRadius: '25px',
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.25)',
  },
  transportButton: {
    width: '50px',
    height: '50px',
    borderRadius: '25px',
    border: 'none',
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
  },
};

export default TransportSelector;
