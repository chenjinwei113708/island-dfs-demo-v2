import { useState } from 'react';
import styles from './DFSIslandVisualizer.module.css';

const initialGrid = [
    [1, 1, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
];

export default function DFSIslandVisualizer() {
    const [grid, setGrid] = useState(initialGrid.map(row => [...row]));
    const [count, setCount] = useState(0);
    const [running, setRunning] = useState(false);

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const reset = () => {
        setGrid(initialGrid.map(row => [...row]));
        setCount(0);
        setRunning(false);
    };

    const dfs = async (i, j, mark) => {
        if (
            i < 0 || i >= grid.length ||
            j < 0 || j >= grid[0].length ||
            grid[i][j] !== 0
        ) return;

        grid[i][j] = mark;
        setGrid(grid.map(row => [...row]));
        await sleep(200);

        await dfs(i + 1, j, mark);
        await dfs(i - 1, j, mark);
        await dfs(i, j + 1, mark);
        await dfs(i, j - 1, mark);
    };

    const runDFS = async () => {
        if (running) return;
        setRunning(true);

        const m = grid.length;
        const n = grid[0].length;

        for (let i = 0; i < m; i++) {
            await dfs(i, 0, 3);
            await dfs(i, n - 1, 3);
        }
        for (let j = 0; j < n; j++) {
            await dfs(0, j, 3);
            await dfs(m - 1, j, 3);
        }

        let localCount = 0;
        for (let i = 1; i < m - 1; i++) {
            for (let j = 1; j < n - 1; j++) {
                if (grid[i][j] === 0) {
                    await dfs(i, j, 2);
                    localCount++;
                    setCount(localCount);
                }
            }
        }

        setRunning(false);
    };

    const getClass = (val) => {
        switch (val) {
            case 1: return styles.water;
            case 0: return styles.land;
            case 2: return styles.visited;
            case 3: return styles.borderLand;
            default: return '';
        }
    };

    return (
        <div className={styles.container}>
            <h2>🌊 DFS 封闭岛可视化</h2>
            <div className={styles.grid}>
                {grid.map((row, i) =>
                    row.map((val, j) => (
                        <div key={`${i}-${j}`} className={`${styles.cell} ${getClass(val)}`} />
                    ))
                )}
            </div>
            <div style={{ marginTop: '12px' }}>
                <button
                    className={styles.button}
                    disabled={running}
                    onClick={runDFS}
                    style={{ marginRight: '8px' }}
                >
                    {running ? '运行中...' : '开始 DFS'}
                </button>
                <button
                    className={styles.button}
                    onClick={reset}
                    disabled={running}
                    style={{ backgroundColor: '#6b7280' }} // 灰色
                >
                    重置
                </button>
            </div>

            <div className={styles.counter}>封闭岛数量test：{count}</div>
        </div>
    );
}