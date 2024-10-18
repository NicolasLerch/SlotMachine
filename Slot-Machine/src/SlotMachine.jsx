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

  const stopReel = (setReel, setReelClass, delay) => {
    return new Promise((resolve) => {
      let currentSymbol = symbols[Math.floor(Math.random() * symbols.length)]; // Definir el símbolo inicial
      const spin = setInterval(() => {
        currentSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        setReel(currentSymbol);  // Cambiar símbolo en cada ciclo
      }, 10);
  
      setTimeout(() => {
        clearInterval(spin);  // Detener el intervalo
        setReel(currentSymbol); // Asegurar que el símbolo actual se mantenga como el final
        setReelClass(""); // Remover clase de giro
        resolve();  // Resolver la promesa
      }, delay);
    });
  };


  const spinReels = async () => {
    setSpinning(true);
    setWinner(false);
  
    spinAudio.play();
    rollingAudio.play();
  
    // Función para detener cada reel con promesas y setIntervals
    // const stopReel = (setReel, setReelClass, delay) => {
    //   return new Promise((resolve) => {
    //     const spin = setInterval(() => {
    //       setReel(symbols[Math.floor(Math.random() * symbols.length)]);
    //     }, 100);
  
    //     setTimeout(() => {
    //       clearInterval(spin);
    //       setReelClass("");
    //       resolve();
    //     }, delay);
    //   });
    // };
  
    // Ejecutar la detención de los reels de manera secuencial
    setReel1Class("spin");
    await stopReel(setReel1, setReel1Class, 1000);
  
    setReel2Class("spin");
    await stopReel(setReel2, setReel2Class, 1000);
  
    setReel3Class("spin");
    await stopReel(setReel3, setReel3Class, 1000);
  
    setSpinning(false); // Finalizar el giro
  };
  


  // Al cargar la página, recuperar el contador de premios de localStorage
  useEffect(() => {
    const storedPrizeCounter = localStorage.getItem("prizeCounter");
    if (storedPrizeCounter) {
      setPrizeCounter(parseInt(storedPrizeCounter, 10));
    }
  }, []);

  const restartCounter = () => {
    setPrizeCounter(0);
  }

  useEffect(() => {
    if (!spinning && reel1 === reel2 && reel2 === reel3) {
      setWinner(true);
      setVisible(true);
      setPrize(reel1);
      const newPrizeCounter = prizeCounter + 1;
      setPrizeCounter(newPrizeCounter);

      localStorage.setItem("prizeCounter", newPrizeCounter);

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

      winnerAudio.play();
    }
  }, [spinning, reel1, reel2, reel3]);

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