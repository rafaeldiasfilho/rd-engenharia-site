// 3D block of an area page: text on the left, rotatable three.js scene on the right.
import Scene3D from "../../Scene3D";

export function AreaScene({ areaScene }) {
  return (
    <section className="band-scene" aria-labelledby="scene-title">
      <div className="container band-scene-grid">
        <div className="band-scene-text reveal">
          <p className="label-mini">{areaScene.label}</p>
          <h2 id="scene-title" className="sec-title">
            {areaScene.title}
          </h2>
          <p>{areaScene.text}</p>
          <p className="fine-print">
            Ilustração em 3D. Arraste com o mouse ou o dedo para girar.
          </p>
        </div>
        <Scene3D scene={areaScene.scene} className="band-scene-3d" label={areaScene.alt} />
      </div>
    </section>
  );
}
