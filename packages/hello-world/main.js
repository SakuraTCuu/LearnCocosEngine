'use strict';

/**
 * 模板字符串 
 */
let FileContent = {
  ts: `const { ccclass, property } = cc._decorator;

  @ccclass
  export default class TestScript extends cc.Component {
      @property(cc.Node)
      TestNode: cc.Node = null;

  }  
  `,
  material: `{
    "__type__": "cc.Material",
    "_name": "builtin-2d-sprite",
    "_objFlags": 0,
    "_native": "",
    "_effectAsset": {
      "__uuid__": "2874f8dd-416c-4440-81b7-555975426e93"
    },
    "_techniqueData": {
      "0": {
        "defines": {
          "USE_TEXTURE": true
        }
      }
    }
  }`,
  effect: `CCEffect %{
    techniques:
    - passes:
      - vert: vs
        frag: fs
        blendState:
          targets:
          - blend: true
        rasterizerState:
          cullMode: none
        properties:
          texture: { value: white }
          alphaThreshold: { value: 0.5 }
  }%
  
  
  CCProgram vs %{
    precision highp float;
  
    #include <cc-global>
    #include <cc-local>
  
    in vec3 a_position;
    in vec4 a_color;
    out vec4 v_color;
  
    #if USE_TEXTURE
    in vec2 a_uv0;
    out vec2 v_uv0;
    #endif
  
    void main () {
      vec4 pos = vec4(a_position, 1);
  
      #if CC_USE_MODEL
      pos = cc_matViewProj * cc_matWorld * pos;
      #else
      pos = cc_matViewProj * pos;
      #endif
  
      #if USE_TEXTURE
      v_uv0 = a_uv0;
      #endif
  
      v_color = a_color;
  
      gl_Position = pos;
    }
  }%
  
  
  CCProgram fs %{
    precision highp float;
    
    #include <alpha-test>
    #include <texture>
  
    in vec4 v_color;
  
    #if USE_TEXTURE
    in vec2 v_uv0;
    uniform sampler2D texture;
    #endif
  
    void main () {
      vec4 o = vec4(1, 1, 1, 1);
  
      #if USE_TEXTURE
        CCTexture(texture, v_uv0, o);
      #endif
  
      o *= v_color;
  
      gl_FragColor = o;
    }
  }%
  `,
  sceneFile: `[
    {
      "__type__": "cc.SceneAsset",
      "_name": "",
      "_objFlags": 0,
      "_native": "",
      "scene": {
        "__id__": 1
      }
    },
    {
      "__type__": "cc.Scene",
      "_objFlags": 0,
      "_parent": null,
      "_children": [
        {
          "__id__": 2
        }
      ],
      "_active": true,
      "_components": [],
      "_prefab": null,
      "_opacity": 255,
      "_color": {
        "__type__": "cc.Color",
        "r": 255,
        "g": 255,
        "b": 255,
        "a": 255
      },
      "_contentSize": {
        "__type__": "cc.Size",
        "width": 0,
        "height": 0
      },
      "_anchorPoint": {
        "__type__": "cc.Vec2",
        "x": 0,
        "y": 0
      },
      "_trs": {
        "__type__": "TypedArray",
        "ctor": "Float64Array",
        "array": [
          0,
          0,
          0,
          0,
          0,
          0,
          1,
          1,
          1,
          1
        ]
      },
      "_is3DNode": true,
      "_groupIndex": 0,
      "groupIndex": 0,
      "autoReleaseAssets": false,
      "_id": "bf32a12e-6142-4d0c-b133-e6a7097af0ec"
    },
    {
      "__type__": "cc.Node",
      "_name": "Canvas",
      "_objFlags": 0,
      "_parent": {
        "__id__": 1
      },
      "_children": [
        {
          "__id__": 3
        },
        {
          "__id__": 5
        }
      ],
      "_active": true,
      "_components": [
        {
          "__id__": 7
        },
        {
          "__id__": 8
        }
      ],
      "_prefab": null,
      "_opacity": 255,
      "_color": {
        "__type__": "cc.Color",
        "r": 255,
        "g": 255,
        "b": 255,
        "a": 255
      },
      "_contentSize": {
        "__type__": "cc.Size",
        "width": 1334,
        "height": 750
      },
      "_anchorPoint": {
        "__type__": "cc.Vec2",
        "x": 0.5,
        "y": 0.5
      },
      "_trs": {
        "__type__": "TypedArray",
        "ctor": "Float64Array",
        "array": [
          667,
          375,
          0,
          0,
          0,
          0,
          1,
          1,
          1,
          1
        ]
      },
      "_eulerAngles": {
        "__type__": "cc.Vec3",
        "x": 0,
        "y": 0,
        "z": 0
      },
      "_skewX": 0,
      "_skewY": 0,
      "_is3DNode": false,
      "_groupIndex": 0,
      "groupIndex": 0,
      "_id": "a5esZu+45LA5mBpvttspPD"
    },
    {
      "__type__": "cc.Node",
      "_name": "Main Camera",
      "_objFlags": 0,
      "_parent": {
        "__id__": 2
      },
      "_children": [],
      "_active": true,
      "_components": [
        {
          "__id__": 4
        }
      ],
      "_prefab": null,
      "_opacity": 255,
      "_color": {
        "__type__": "cc.Color",
        "r": 255,
        "g": 255,
        "b": 255,
        "a": 255
      },
      "_contentSize": {
        "__type__": "cc.Size",
        "width": 960,
        "height": 640
      },
      "_anchorPoint": {
        "__type__": "cc.Vec2",
        "x": 0.5,
        "y": 0.5
      },
      "_trs": {
        "__type__": "TypedArray",
        "ctor": "Float64Array",
        "array": [
          0,
          0,
          525.9209897419687,
          0,
          0,
          0,
          1,
          1,
          1,
          1
        ]
      },
      "_eulerAngles": {
        "__type__": "cc.Vec3",
        "x": 0,
        "y": 0,
        "z": 0
      },
      "_skewX": 0,
      "_skewY": 0,
      "_is3DNode": false,
      "_groupIndex": 0,
      "groupIndex": 0,
      "_id": "e1WoFrQ79G7r4ZuQE3HlNb"
    },
    {
      "__type__": "cc.Camera",
      "_name": "",
      "_objFlags": 0,
      "node": {
        "__id__": 3
      },
      "_enabled": true,
      "_cullingMask": 4294967295,
      "_clearFlags": 7,
      "_backgroundColor": {
        "__type__": "cc.Color",
        "r": 0,
        "g": 0,
        "b": 0,
        "a": 255
      },
      "_depth": -1,
      "_zoomRatio": 1,
      "_targetTexture": null,
      "_fov": 60,
      "_orthoSize": 10,
      "_nearClip": 1,
      "_farClip": 4096,
      "_ortho": true,
      "_rect": {
        "__type__": "cc.Rect",
        "x": 0,
        "y": 0,
        "width": 1,
        "height": 1
      },
      "_renderStages": 1,
      "_alignWithScreen": true,
      "_id": "81GN3uXINKVLeW4+iKSlim"
    },
    {
      "__type__": "cc.Node",
      "_name": "Background",
      "_objFlags": 0,
      "_parent": {
        "__id__": 2
      },
      "_children": [],
      "_active": true,
      "_components": [
        {
          "__id__": 6
        }
      ],
      "_prefab": null,
      "_opacity": 255,
      "_color": {
        "__type__": "cc.Color",
        "r": 34,
        "g": 93,
        "b": 45,
        "a": 255
      },
      "_contentSize": {
        "__type__": "cc.Size",
        "width": 1334,
        "height": 750
      },
      "_anchorPoint": {
        "__type__": "cc.Vec2",
        "x": 0.5,
        "y": 0.5
      },
      "_trs": {
        "__type__": "TypedArray",
        "ctor": "Float64Array",
        "array": [
          0,
          0,
          0,
          0,
          0,
          0,
          1,
          1,
          1,
          1
        ]
      },
      "_eulerAngles": {
        "__type__": "cc.Vec3",
        "x": 0,
        "y": 0,
        "z": 0
      },
      "_skewX": 0,
      "_skewY": 0,
      "_is3DNode": false,
      "_groupIndex": 0,
      "groupIndex": 0,
      "_id": "d1BKvyKH9LbJhChJIxRQr+"
    },
    {
      "__type__": "cc.Sprite",
      "_name": "",
      "_objFlags": 0,
      "node": {
        "__id__": 5
      },
      "_enabled": true,
      "_materials": [
        {
          "__uuid__": "eca5d2f2-8ef6-41c2-bbe6-f9c79d09c432"
        }
      ],
      "_srcBlendFactor": 770,
      "_dstBlendFactor": 771,
      "_spriteFrame": {
        "__uuid__": "a23235d1-15db-4b95-8439-a2e005bfff91"
      },
      "_type": 0,
      "_sizeMode": 0,
      "_fillType": 0,
      "_fillCenter": {
        "__type__": "cc.Vec2",
        "x": 0,
        "y": 0
      },
      "_fillStart": 0,
      "_fillRange": 0,
      "_isTrimmedMode": true,
      "_atlas": null,
      "_id": "eebnJNCIpHC6DivFqPYtEC"
    },
    {
      "__type__": "cc.Canvas",
      "_name": "",
      "_objFlags": 0,
      "node": {
        "__id__": 2
      },
      "_enabled": true,
      "_designResolution": {
        "__type__": "cc.Size",
        "width": 1334,
        "height": 750
      },
      "_fitWidth": false,
      "_fitHeight": true,
      "_id": "59Cd0ovbdF4byw5sbjJDx7"
    },
    {
      "__type__": "cc.Widget",
      "_name": "",
      "_objFlags": 0,
      "node": {
        "__id__": 2
      },
      "_enabled": true,
      "alignMode": 1,
      "_target": null,
      "_alignFlags": 45,
      "_left": 0,
      "_right": 0,
      "_top": 0,
      "_bottom": 0,
      "_verticalCenter": 0,
      "_horizontalCenter": 0,
      "_isAbsLeft": true,
      "_isAbsRight": true,
      "_isAbsTop": true,
      "_isAbsBottom": true,
      "_isAbsHorizontalCenter": true,
      "_isAbsVerticalCenter": true,
      "_originalWidth": 0,
      "_originalHeight": 0,
      "_id": "29zXboiXFBKoIV4PQ2liTe"
    }
  ]`
}

/**
 * 生成新的uuid
 * @returns
 */
let randomUuid = () => {
  return Editor.Utils.UuidUtils.decompressUuid(Editor.Utils.UuidUtils.uuid())
}

module.exports = {
  load() {
    // 当 package 被正确加载的时候执行
    console.log("load suc");
  },

  unload() {
    // 当 package 被正确卸载的时候执行
  },

  messages: {
    'createFile'() {
      let file_uuid = Editor.Selection.curSelection("asset");
      for (let i = 0; i < file_uuid.length; i++) {
        let path = Editor.assetdb.uuidToUrl(file_uuid[i]);
        let fileName = path.split('/').pop();
        FileContent.material = FileContent.material.replace("builtin-2d-sprite", `sprite-${fileName}`);
        FileContent.ts = FileContent.ts.replace("TestScript", `${fileName}Ctrl`);

        Editor.assetdb.create(`${path}/${fileName}Ctrl.ts`, FileContent.ts);
        Editor.assetdb.create(`${path}/sprite-${fileName}.effect`, FileContent.effect);
        Editor.assetdb.create(`${path}/sprite-${fileName}.mtl`, FileContent.material);
        Editor.assetdb.create(`${path}/${fileName}.fire`, FileContent.sceneFile);
        Editor.log('生成资源文件完成!');
      }
    },
    'deleteFile'() {
      let file_uuid = Editor.Selection.curSelection("asset");
      for (let i = 0; i < file_uuid.length; i++) {
        let path = Editor.assetdb.uuidToUrl(file_uuid[i]);
        let fileName = path.split('/').pop();

        Editor.assetdb.delete([
          `${path}/${fileName}Ctrl.ts`,
          `${path}/sprite-${fileName}.effect`,
          `${path}/sprite-${fileName}.mtl`,
          `${path}/${fileName}.fire`]);
        Editor.log('删除资源文件完成!');
      }
    }
  },
};