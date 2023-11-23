import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

interface ControlsInterface {
  playToggle: () => void;
}

const Controls = ({ playToggle }: ControlsInterface) => {
  return (
    <section className="controls">
      <button onClick={() => playToggle()}>
        <FontAwesomeIcon icon={faPlay} />
        <FontAwesomeIcon icon={faPause} />
      </button>
      <div id="timeline">
        <div className="bar">
          <div className="inner"></div>
        </div>
      </div>
    </section>
  );
};
export default Controls;
