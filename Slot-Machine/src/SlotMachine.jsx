import React, { useState, useEffect , useRef} from "react";
import "./SlotMachine.css";
import spinSound from "./assets/sounds/spin-sound.mp3";
import spinningSound from "./assets/sounds/rolling-sound.mp3";
import winSound from "./assets/sounds/winner-alert2.wav";
import esmalte from "./assets/images/esmalte.png";
import fragancia from "./assets/images/Fragancia.png";
import protectorSolar from "./assets/images/protector-solar.png";
import colorCorrecting from "./assets/images/color-correcting.png";
import setEsponja from "./assets/images/set-esponja.png";
import logo from "./assets/images/Logo_GTL_white.png";
import PrizeAlert from "./Components/PrizeAlert";
import bgAudioFile from "./assets/sounds/background-music.mp3";
import bgAudioFile2 from "./assets/sounds/bg-music2.mp3";

const symbols = [
  fragancia,
  protectorSolar,
  esmalte,
  colorCorrecting,
  setEsponja,
];

const SlotMachine = ({ toggleTheme, theme }) => {
  const [reel1, setReel1] = useState(esmalte);
  const [reel2, setReel2] = useState(fragancia);
  const [reel3, setReel3] = useState(protectorSolar);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(false);
  const [visible, setVisible] = useState(false);
  const [prize, setPrize] = useState("");
  const [reel1Class, setReel1Class] = useState("");
  const [reel2Class, setReel2Class] = useState("");
  const [reel3Class, setReel3Class] = useState("");
  const [prizeCounter, setPrizeCounter] = useState(7);
  const [isPlaying, setIsPlaying] = useState(false);
  const bgAudio = useRef(new Audio(bgAudioFile));
  const [disabled, setDisabled] = useState(false);

  const spinAudio = new Audio(spinSound);
  const rollingAudio = new Audio(spinningSound);
  const winnerAudio = new Audio(winSound);
  const bgAudio2 = new Audio(bgAudioFile2);

  useEffect(() => {
    const audio = bgAudio.current;
    audio.loop = true;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const handleSound = () => {
    const audio = bgAudio.current; 
    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

    const spinReels = async () => {
      setDisabled(true);
      setSpinning(true);
      setWinner(false);
      

      spinAudio.play();
      rollingAudio.play();

      const randomReel1 = getRandomSymbolSequence();
      const randomReel2 = getRandomSymbolSequence();
      const randomReel3 = getRandomSymbolSequence();

      setReel1Class("spin")
      setReel2Class("spin")
      setReel3Class("spin")

      // Función para realizar la animación de cada reel
      await animateReel(setReel1, randomReel1, 1000);
      await animateReel(setReel2, randomReel2, 1000);
      await animateReel(setReel3, randomReel3, 1000);

      setSpinning(false);
      checkWinner(randomReel1[0], randomReel2[0], randomReel3[0]);

      setTimeout(() => {
        setReel1Class("");
        setReel2Class("");
        setReel3Class("");
      }, 4000);

      setTimeout(() => {
        setDisabled(false);
      },2000)
      
    };

  

  const getRandomSymbolSequence = () => {
    // Genera una secuencia de símbolos aleatorios para simular el giro
    const sequence = [];
    for (let i = 0; i < 20; i++) {
      sequence.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }
    return sequence;
  };

  const animateReel = (setReel, symbolSequence, delay) => {
    return new Promise((resolve) => {
      let index = symbolSequence.length - 1;
      const interval = setInterval(() => {
        setReel(symbolSequence[index]);  // Mostrar el siguiente símbolo en la secuencia
        index--;
        if (index < 0) index = symbolSequence.length - 1;
      }, 100);

      setTimeout(() => {
        clearInterval(interval); // Detener el giro al finalizar el tiempo de animación
        setReel(symbolSequence[0]);  // Fijar el símbolo final como el resultado
        
        resolve();
      }, delay);
    });
  };

  const checkWinner = (reel1Result, reel2Result, reel3Result) => {
    if (reel1Result === reel2Result && reel2Result === reel3Result) {
      setWinner(true);
      setVisible(true);
      setPrize(reel1Result);
      setReel1(reel1Result);

      switch (reel1) {
        case esmalte:
          setPrize("un esmalte");
          break;
        case fragancia:
          setPrize("una fragancia");
          break;
        case protectorSolar:
          setPrize("un protector solar");
          break;
        case colorCorrecting:
          setPrize("un corrector");
          break;
        case setEsponja:
          setPrize("un set de esponjas");
          break;
        default:
          setPrize("");
      }

      const newPrizeCounter = prizeCounter + 1;
      setPrizeCounter(newPrizeCounter);
      localStorage.setItem("prizeCounter", newPrizeCounter);

      winnerAudio.play();
    }
  };

  return (
    <div className={theme}>
      <div className="slot-machine-container">
        {
          <div className={`winner-banner ${winner ? "winner-blink" : ""}`}>
            <img src={logo} alt="Logo" className="logo-image" />
          </div>
        }

        <div className="reels-container">
          <div className="reel">
            <img
              src={reel1}
              alt="Reel 2"
              className={`reel-image ${spinning ? reel1Class : ""}`}
            />
          </div>
          <div className="reel">
            <img
              src={reel2}
              alt="Reel 2"
              className={`reel-image ${spinning ? reel2Class : ""}`}
            />
          </div>
          <div className="reel">
            <img
              src={reel3}
              alt="Reel 2"
              className={`reel-image ${spinning ? reel3Class : ""}`}
            />
          </div>
        </div>

        <div className="slot-machine-bottom">
          {/* <div className="slot-machine-bottom-left">
            <button className="toggle-theme-button" onClick={restartCounter}>
              Reiniciar contador
            </button>
          </div> */}

          <div className="slot-machine-bottom-center">
            <button
              className="spin-button"
              onClick={spinReels}
              disabled={spinning}
              style={{ pointerEvents: disabled ? "none" : "auto", cursor: disabled ? "not-allowed" : "pointer", backgroundColor: !disabled ? "rgba(199, 6, 6, 0.664)" : "rgba(199, 6, 6, 0.264)" }}
            >
              TIRAR
            </button>
          </div>

          <div className="slot-machine-bottom-right">
            <div>
              <p className="prize-counter">Premios ganados: {prizeCounter}</p>
            </div>
          </div>
        </div>
        <button className="toggle-theme-button" onClick={handleSound}>
            {isPlaying ? (<i className="fa-solid fa-volume-off"></i>) : (<i className="fa-solid fa-volume-high"></i>) }
            </button>
        
      </div>
      

      {winner && visible ? (
        <PrizeAlert prize={prize} img={reel1} setVisible={setVisible} />
      ) : null}
    </div>
  );
};

export default SlotMachine;