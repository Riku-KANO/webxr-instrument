import React, { useState } from 'react'

function Instructions(): React.JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-5 right-5 px-4 py-2.5 bg-blue-500 text-white border-none rounded cursor-pointer z-[1001] text-sm hover:bg-blue-600 transition-colors"
      >
        使い方を見る
      </button>
    )
  }

  return (
    <div className="fixed top-5 left-5 right-5 bg-black/90 text-white p-5 rounded-lg z-[1001] max-w-[500px] mx-auto text-sm leading-relaxed">
      <div className="flex justify-between items-center mb-4">
        <h3 className="m-0 text-green-400 text-lg font-semibold">
          🎵 WebXR楽器の使い方
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="bg-transparent border-none text-white text-lg cursor-pointer p-0 w-6 h-6 hover:text-gray-300 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="mb-4">
        <h4 className="m-0 mb-2 text-yellow-400 font-medium">
          📱 デスクトップ/モバイル:
        </h4>
        <ul className="m-0 pl-5 space-y-1">
          <li>緑/赤のボックスをクリックして音の再生/停止</li>
          <li>音程は固定（200Hz）で再生されます</li>
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="m-0 mb-2 text-red-400 font-medium">🥽 VRモード:</h4>
        <ul className="m-0 pl-5 space-y-1">
          <li>
            <strong>VRに入る:</strong> 下の「ENTER VR」ボタンをクリック
          </li>
          <li>
            <strong>音の制御:</strong> 青いボックスをコントローラーでクリック
          </li>
          <li>
            <strong>音程変更:</strong> 右手を上下に動かすと音の高さが変化
          </li>
          <li>
            <strong>視覚効果:</strong>{' '}
            手の位置に球体、音程に応じてボックスの色が変化
          </li>
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="m-0 mb-2 text-purple-400 font-medium">
          🎮 対応デバイス:
        </h4>
        <p className="m-0 text-[13px] opacity-90">
          Meta Quest 2/3/Pro, HTC Vive, Valve Index など WebXR 対応ヘッドセット
        </p>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-3 py-2 bg-purple-600 text-white rounded cursor-pointer hover:bg-purple-700 transition-colors text-sm"
        >
          {showAdvanced ? '▼' : '▶'} アドバンスモードの使い方
        </button>

        {showAdvanced && (
          <div className="mt-3 p-3 bg-purple-900/30 rounded">
            <h4 className="m-0 mb-2 text-purple-300 font-medium">
              🎛️ アドバンスモード機能:
            </h4>
            <ul className="m-0 pl-5 space-y-1 text-xs">
              <li>
                <strong>右手:</strong>{' '}
                Y軸で音程、回転で波形変更（サイン波→矩形波→三角波→のこぎり波）
              </li>
              <li>
                <strong>左手:</strong> Y軸で音量、回転でフィルター周波数
              </li>
              <li>
                <strong>両手の距離:</strong> ビブラート効果の強さ
              </li>
              <li>
                <strong>右トリガー:</strong> 押している間だけ音を再生
              </li>
              <li>
                <strong>視覚フィードバック:</strong>{' '}
                リアルタイムで音のパラメータを表示
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="text-center mt-4 pt-4 border-t border-white/30 text-xs opacity-80">
        🎶 両手を使って複雑な音を作り出そう！
      </div>
    </div>
  )
}

export default Instructions
