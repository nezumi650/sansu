"use strict";

(function () {
  const urlParams = new URL(window.location.href).searchParams;
  // charAt()は、初期リリース時、urlパラメータを mode=t1 のフォーマットでリリースしたことの名残
  const mode = urlParams.get("mode").charAt(0);
  const level =
    (urlParams.get("mode").charAt(1) || urlParams.get("level") || 1) * 1;
  createMondai();

  // 解答時の効果音
  const okSound = new Audio("./sounds/ok.mp3");
  const ngSound = new Audio("./sounds/ng.mp3");

  // 数字の入力
  function writeNum(num) {
    const answer = document.getElementById("answerText");
    if (answer.innerText.length < 2) {
      answer.innerText = answer.innerText.replace("？", "") + num;
    }
  }

  // 解答する
  function finish() {
    const answer = document.getElementById("answerText").innerText * 1;
    const seikai = document.getElementById("shiki").getAttribute("value") * 1;
    if (answer === seikai) {
      document.getElementById("hamanaru").style.display = "flex";
      document.getElementById("hamanaru").src = "./images/hanamaru.gif";
      okSound.play();
    } else {
      const prefix =
        Math.abs(answer - seikai) === 1 ? "おしい！" : "ざんねん！";
      document.getElementById("resultMessage").innerText =
        prefix + `せいかいは ${seikai} だよ！`;
      document.getElementById("resultMessage").style.display = "inline-block";
      ngSound.play();
    }
  }

  // 「けす」ボタンの操作
  function retry() {
    document.getElementById("answerText").innerText = "？";
    syokika();
  }

  // 「つぎ」ボタンの操作
  function skip() {
    document.getElementById("answerText").innerText = "？";
    createMondai();
    syokika();
  }

  // 初期化
  function syokika() {
    // 解答時のエフェクトの削除
    const effects = document.getElementsByClassName("effects");
    for (let i = 0; i < effects.length; i++) {
      effects[i].style.display = "none";
    }
    document.getElementById("hamanaru").src = "";
  }

  // 問題の作成
  function createMondai() {
    let num1, num2;
    const shiki = document.getElementById("shiki");

    if (mode === "t") {
      // たしざん
      if (level === 1) {
        // くりあがり、10の位の計算無し
        // = 1の位の合計が9以下、かつ右辺と左辺の合計が19以下
        num1 = Math.floor(Math.random() * 9);
        num2 = Math.floor(Math.random() * (9 - num1)) + 1;
        if (num1 === 0 || Math.floor(Math.random() * 2) === 1) {
          // 左辺の1の位が0、または50% の確率でnum1の10の位を10にする
          num1 += 10;
        }
      } else if (level === 2) {
        // くりあがり有り、10の位の計算無し
        num1 = randRange({ min: 2, max: 9 }); // 1を考慮した問題を作るのが難しい
        num2 = randRange({ min: 11 - num1, max: 9 });
        const rand = Math.floor(Math.random() * 3);
        if (rand === 2) {
          num1 += 10;
        } else if (rand === 1) {
          num2 += 10;
        }
      }
      shiki.setAttribute("value", num1 + num2);
      shiki.innerText = `${num1}+${num2}=`;
    } else if (mode === "h") {
      // ひきざん
      if (level === 1) {
        // くりさがり、10の位の計算無し
        // = 1の位の左辺が右辺と同じ、または大きい
        num1 = randRange({ min: 2, max: 9 });
        num2 = Math.floor(Math.random() * num1) + 1;
        if (Math.floor(Math.random() * 2) === 1) {
          // 50% の確率で、num1の10の位を10にする
          num1 = num1 + 10;
        }
      } else if (level === 2) {
        // くりさがり有り、10の位の計算とマイナス解無し。
        num2 = Math.floor(Math.random() * 9) + 1;
        num1 =
          Math.floor(Math.random() * num2) +
          10 +
          Math.floor(Math.random() * 2) * 10;
      }
      shiki.setAttribute("value", num1 - num2);
      shiki.innerText = `${num1}-${num2}=`;
    }
  }

  function randRange({ min, max }) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // 処理を割当
  document.getElementById("finishButton").onclick = finish;
  document.getElementById("skip").onclick = skip;
  document.getElementById("retry").onclick = retry;
  const numButtons = document.getElementsByClassName("numButtons");
  for (let i = 0; i < numButtons.length; i++) {
    numButtons[i].onclick = function () {
      writeNum(numButtons[i].innerText);
    };
  }
})();
