clc; clear all; close all;

[V,F] = readOBJ('data.obj');
% V = normalizeUnitBox(V);
% V = V - 0.5;
% V(:,2) = -V(:,2);
tmp = F(:,1);
F(:,1) = F(:,2);
F(:,2) = tmp;
writeOBJ('data.obj',V,F);