import level0 from './level0.json';
import level1 from './level1.json';
import level2 from './level2.json';
import level3 from './level3.json';
import level4 from './level4.json';

export default function extract(level) {
    switch (level) {
        case "level0":
            return level0;
        case "level1":
            return level1;
        case "level2":
            return level2;
        case "level3":
            return level3;
        case "level4":
            return level4;
        default:
            return level0;
    }
}  