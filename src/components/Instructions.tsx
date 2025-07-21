import React, { useState } from 'react'

function Instructions(): React.JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(true)

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '10px 15px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 1001,
          fontSize: '14px'
        }}
      >
        使い方を見る
      </button>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      right: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      zIndex: 1001,
      maxWidth: '500px',
      margin: '0 auto',
      fontSize: '14px',
      lineHeight: '1.5'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, color: '#4CAF50' }}>🎵 WebXR楽器の使い方</h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '0',
            width: '24px',
            height: '24px'
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#FFD700' }}>📱 デスクトップ/モバイル:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>緑/赤のボックスをクリックして音の再生/停止</li>
          <li>音程は固定（200Hz）で再生されます</li>
        </ul>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#FF6B6B' }}>🥽 VRモード:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li><strong>VRに入る:</strong> 下の「ENTER VR」ボタンをクリック</li>
          <li><strong>音の制御:</strong> 青いボックスをコントローラーでクリック</li>
          <li><strong>音程変更:</strong> 右手を上下に動かすと音の高さが変化</li>
          <li><strong>視覚効果:</strong> 手の位置に球体、音程に応じてボックスの色が変化</li>
        </ul>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#9B59B6' }}>🎮 対応デバイス:</h4>
        <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>
          Meta Quest 2/3/Pro, HTC Vive, Valve Index など WebXR 対応ヘッドセット
        </p>
      </div>

      <div style={{ 
        textAlign: 'center', 
        marginTop: '15px', 
        paddingTop: '15px', 
        borderTop: '1px solid rgba(255,255,255,0.3)',
        fontSize: '12px',
        opacity: 0.8
      }}>
        🎶 右手を上下に動かして演奏を楽しもう！
      </div>
    </div>
  )
}

export default Instructions