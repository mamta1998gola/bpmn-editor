import React, { useEffect, useRef, useState } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

const BpmnEditor = () => {
  const bpmnModeler = useRef(null);
  const canvasRef = useRef(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    bpmnModeler.current = new BpmnModeler({
      container: canvasRef.current,
      width: '100%',
      height: '600px',
    });

    const initialDiagram = `
    <?xml version="1.0" encoding="UTF-8"?>
    <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                      xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                      xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                      xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd"
                      id="sample-diagram"
                      targetNamespace="http://bpmn.io/schema/bpmn">
      <bpmn:process id="Process_1" isExecutable="false">
        <bpmn:startEvent id="StartEvent_1"/>
      </bpmn:process>
      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
          <bpmndi:BPMNShape id="BPMNShape_StartEvent_1" bpmnElement="StartEvent_1">
            <dc:Bounds x="173" y="102" width="36" height="36"/>
          </bpmndi:BPMNShape>
        </bpmndi:BPMNPlane>
      </bpmndi:BPMNDiagram>
    </bpmn:definitions>`;

    bpmnModeler.current
      .importXML(initialDiagram)
      .then(() => {
        const canvas = bpmnModeler.current.get('canvas');
        canvas.zoom('fit-viewport');
      })
      .catch((err) => {
        console.error('Failed to import BPMN diagram', err);
        setLoadError('Failed to load BPMN diagram. Please try again.');
      });

    return () => {
      bpmnModeler.current.destroy();
    };
  }, []);

  const handleExport = async () => {
    try {
      const { xml } = await bpmnModeler.current.saveXML({ format: true });
      downloadFile(xml, 'diagram.bpmn');
    } catch (err) {
      console.error('Error exporting BPMN:', err);
    }
  };

  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {loadError && <p style={{ color: 'red' }}>{loadError}</p>}
      <div ref={canvasRef} style={{ height: '600px', width: '100%', border: '1px solid #ccc' }}></div>
      <button onClick={handleExport} style={{ marginTop: '10px' }}>
        Export BPMN Model
      </button>
    </div>
  );
};

export default BpmnEditor;
